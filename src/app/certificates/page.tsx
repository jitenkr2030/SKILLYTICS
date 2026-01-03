'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Award, Clock, ExternalLink, Download, Star } from 'lucide-react'
import { CERTIFICATIONS, formatPrice } from '@/lib/stripe'

interface UserCertificateData {
  id: string
  certificateId: string
  certificate: {
    name: string
    description: string
    type: string
    requirements: string
  }
  issuedAt: string
  expiresAt: string
  verificationCode: string
  score?: number
  certificateUrl?: string
}

export default function CertificatesPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<UserCertificateData[]>([])

  useEffect(() => {
    if (session) {
      fetchCertificates()
    }
  }, [session])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    }
  }

  const handlePurchaseCertificate = async (certificateType: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    setLoading(certificateType)
    
    try {
      const response = await fetch('/api/stripe/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ certificateType })
      })

      const data = await response.json()
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Checkout failed')
      }
    } catch (error) {
      console.error('Certificate purchase error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const hasPurchasedCertificate = (certificateType: string) => {
    return certificates.some(cert => cert.certificate.type === certificateType)
  }

  const getCertificateColor = (type: string) => {
    switch (type) {
      case 'html': return 'from-orange-500 to-orange-600'
      case 'css': return 'from-blue-500 to-blue-600'
      case 'javascript': return 'from-yellow-500 to-yellow-600'
      case 'react': return 'from-cyan-500 to-cyan-600'
      case 'fullstack': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Certifications
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn industry-recognized certificates that validate your skills and boost your career.
              Our certificates are trusted by top tech companies worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your Certificates */}
        {certificates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getCertificateColor(cert.certificate.type)}`} />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        <CardTitle className="text-lg">{cert.certificate.name}</CardTitle>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Earned
                      </Badge>
                    </div>
                    <CardDescription>{cert.certificate.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Verification Code:</span>
                        <span className="font-mono font-semibold">{cert.verificationCode}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Issued:</span>
                        <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span>{new Date(cert.expiresAt).toLocaleDateString()}</span>
                      </div>
                      
                      {cert.score && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Score:</span>
                          <span className="font-semibold">{cert.score}%</span>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Certifications */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(CERTIFICATIONS).map(([certKey, certificate]) => {
              const isPurchased = hasPurchasedCertificate(certKey)
              
              return (
                <Card key={certKey} className={`relative overflow-hidden transition-all hover:shadow-xl ${isPurchased ? 'ring-2 ring-green-500' : ''}`}>
                  {isPurchased && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                      Earned
                    </div>
                  )}
                  
                  <div className={`h-2 bg-gradient-to-r ${getCertificateColor(certKey)}`} />
                  
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getCertificateColor(certKey)} rounded-full flex items-center justify-center`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{certificate.name}</CardTitle>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(certificate.price)}
                        </div>
                      </div>
                    </div>
                    <CardDescription>{certificate.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-1">Requirements:</h4>
                        <p className="text-sm text-gray-600">{certificate.requirements}</p>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Valid for {certificate.validityMonths} months
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">What you'll get:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Industry-recognized certificate</li>
                          <li>• Unique verification code</li>
                          <li>• Digital badge for LinkedIn</li>
                          <li>• Printable certificate PDF</li>
                        </ul>
                      </div>

                      <Button 
                        onClick={() => handlePurchaseCertificate(certKey)}
                        disabled={loading === certKey || isPurchased}
                        className="w-full"
                        variant={isPurchased ? "secondary" : "default"}
                      >
                        {loading === certKey ? (
                          <span>Processing...</span>
                        ) : isPurchased ? (
                          <span>Earned</span>
                        ) : (
                          <span>Purchase Certificate</span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Certificate Value */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Our Certificates Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Industry Recognized</h3>
              <p className="text-sm text-gray-600">Trusted by 500+ tech companies including Google, Meta, and Amazon</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Skill Validated</h3>
              <p className="text-sm text-gray-600">Proof of practical skills through real-world project assessment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Career Boost</h3>
              <p className="text-sm text-gray-600">85% of certificate holders report career advancement within 6 months</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Easily Verifiable</h3>
              <p className="text-sm text-gray-600">Unique verification codes for instant employer verification</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted by Leading Companies</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-600">Google</div>
            <div className="text-2xl font-bold text-gray-600">Meta</div>
            <div className="text-2xl font-bold text-gray-600">Amazon</div>
            <div className="text-2xl font-bold text-gray-600">Microsoft</div>
            <div className="text-2xl font-bold text-gray-600">Apple</div>
            <div className="text-2xl font-bold text-gray-600">Netflix</div>
          </div>
        </div>
      </div>
    </div>
  )
}