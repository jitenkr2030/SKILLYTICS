'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, Star, Calendar, FileText, Users, Award } from 'lucide-react'
import { CAREER_SERVICES, formatPrice } from '@/lib/stripe'

interface CareerServiceData {
  id: string
  type: string
  status: string
  scheduledAt?: string
  completedAt?: string
  notes?: string
  createdAt: string
}

export default function CareerServicesPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [services, setServices] = useState<CareerServiceData[]>([])

  useEffect(() => {
    if (session) {
      fetchCareerServices()
    }
  }, [session])

  const fetchCareerServices = async () => {
    try {
      const response = await fetch('/api/career-services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Failed to fetch career services:', error)
    }
  }

  const handlePurchaseService = async (serviceType: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    setLoading(serviceType)
    
    try {
      const response = await fetch('/api/stripe/career-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serviceType })
      })

      const data = await response.json()
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Checkout failed')
      }
    } catch (error) {
      console.error('Service purchase error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'resume_review': return FileText
      case 'interview_prep': return Users
      case 'career_coaching': return Award
      default: return Star
    }
  }

  const hasPurchasedService = (serviceType: string) => {
    return services.some(service => service.type === serviceType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accelerate your career with professional services from industry experts.
              Get personalized guidance to land your dream job.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your Services */}
        {services.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Career Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = getServiceIcon(service.type)
                const serviceDetails = CAREER_SERVICES[service.type as keyof typeof CAREER_SERVICES]
                
                return (
                  <Card key={service.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-blue-500" />
                          <CardTitle className="text-lg">{serviceDetails.name}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>{serviceDetails.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {service.scheduledAt && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Scheduled: {new Date(service.scheduledAt).toLocaleDateString()}
                          </div>
                        )}
                        {service.completedAt && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 mr-2" />
                            Completed: {new Date(service.completedAt).toLocaleDateString()}
                          </div>
                        )}
                        {service.notes && (
                          <div className="text-sm text-gray-600 mt-2">
                            <strong>Notes:</strong> {service.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Services */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(CAREER_SERVICES).map(([serviceKey, service]) => {
              const Icon = getServiceIcon(serviceKey)
              const isPurchased = hasPurchasedService(serviceKey)
              
              return (
                <Card key={serviceKey} className={`relative overflow-hidden transition-all hover:shadow-xl ${isPurchased ? 'ring-2 ring-green-500' : ''}`}>
                  {isPurchased && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                      Purchased
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Delivery: {service.deliveryTime}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">What's included:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {serviceKey === 'resume_review' && (
                            <>
                              <li>• Comprehensive resume review</li>
                              <li>• ATS optimization tips</li>
                              <li>• Formatting and structure feedback</li>
                              <li>• Keyword optimization</li>
                            </>
                          )}
                          {serviceKey === 'interview_prep' && (
                            <>
                              <li>• Mock technical interviews</li>
                              <li>• Behavioral question coaching</li>
                              <li>• Company-specific preparation</li>
                              <li>• Follow-up strategies</li>
                            </>
                          )}
                          {serviceKey === 'career_coaching' && (
                            <>
                              <li>• 3-month personalized coaching</li>
                              <li>• Career path planning</li>
                              <li>• Salary negotiation training</li>
                              <li>• Network building strategies</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <Button 
                        onClick={() => handlePurchaseService(serviceKey)}
                        disabled={loading === serviceKey || isPurchased}
                        className="w-full"
                        variant={isPurchased ? "secondary" : "default"}
                      >
                        {loading === serviceKey ? (
                          <span>Processing...</span>
                        ) : isPurchased ? (
                          <span>Purchased</span>
                        ) : (
                          <span>Purchase Service</span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Sarah K.</h3>
              <p className="text-sm text-gray-600 mb-2">Frontend Developer at Google</p>
              <p className="text-sm italic">"The resume review service helped me land my dream job. The feedback was invaluable!"</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Mike R.</h3>
              <p className="text-sm text-gray-600 mb-2">Full-Stack Developer at Meta</p>
              <p className="text-sm italic">"The interview prep was exactly what I needed. Mock interviews made all the difference."</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Emily L.</h3>
              <p className="text-sm text-gray-600 mb-2">Senior Developer at Amazon</p>
              <p className="text-sm italic">"Career coaching helped me transition from junior to senior in just 18 months!"</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}