'use client'

import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge"

export default function DesignSystem() {
    const sampleStatuses = ['active', 'pending', 'cancelled', 'draft']

    return (
        <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #2B2D42 0%, #8D99AE 50%, #2B2D42 100%)' }}>
            <div className="container mx-auto p-8 space-y-12">                {/* Header */}
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-bold" style={{ background: 'linear-gradient(135deg, #EDF2F4 0%, #FF9F1C 50%, #EDF2F4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        RunDay Design System
                    </h1>
                    <p className="text-xl" style={{ color: '#8D99AE' }}>
                        Professional Running Event Platform - Clean & Athletic Design
                    </p>
                </div>                {/* Color Palette */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">New Color Palette Test</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#2B2D42' }}></div>
                            <p className="text-sm text-gray-400">Primary Navy</p>
                            <code className="text-xs text-gray-500">#2B2D42</code>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#8D99AE' }}></div>
                            <p className="text-sm text-gray-400">Blue Gray</p>
                            <code className="text-xs text-gray-500">#8D99AE</code>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#EDF2F4' }}></div>
                            <p className="text-sm text-gray-400">Off White</p>
                            <code className="text-xs text-gray-500">#EDF2F4</code>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#FF9F1C' }}></div>
                            <p className="text-sm text-gray-400">Accent Orange</p>
                            <code className="text-xs text-gray-500">#FF9F1C</code>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#EF233C' }}></div>
                            <p className="text-sm text-gray-400">Accent Red</p>
                            <code className="text-xs text-gray-500">#EF233C</code>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg border border-gray-600" style={{ backgroundColor: '#D80032' }}></div>
                            <p className="text-sm text-gray-400">Dark Red</p>
                            <code className="text-xs text-gray-500">#D80032</code>
                        </div>
                    </div>
                </section>                {/* Buttons */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">Buttons</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary Action</Button>
                                <Button variant="secondary">Secondary Action</Button>
                                <Button variant="accent">Accent Action</Button>
                                <Button variant="danger">Danger Action</Button>
                                <Button variant="ghost">Ghost Action</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Sizes</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button size="sm" variant="primary">Small</Button>
                                <Button size="md" variant="primary">Medium</Button>
                                <Button size="lg" variant="primary">Large</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">States</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary" isLoading>Loading...</Button>
                                <Button variant="secondary" disabled>Disabled</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">New Color Scheme Test</h3>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                    style={{ backgroundColor: '#EDF2F4', color: '#2B2D42' }}
                                >
                                    Light Primary
                                </button>
                                <button
                                    className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                    style={{ backgroundColor: '#FF9F1C', color: '#2B2D42' }}
                                >
                                    Orange Accent
                                </button>
                                <button
                                    className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105 border-2"
                                    style={{ backgroundColor: 'transparent', color: '#8D99AE', borderColor: '#8D99AE' }}
                                >
                                    Blue Gray Outline
                                </button>
                                <button
                                    className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                    style={{ backgroundColor: '#EF233C', color: '#EDF2F4' }}
                                >
                                    Red Accent
                                </button>
                                <button
                                    className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                    style={{ backgroundColor: '#D80032', color: '#EDF2F4' }}
                                >
                                    Dark Red
                                </button>
                            </div>
                        </div>
                    </div>
                </section>                {/* Cards */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">Cards</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <Card variant="default">
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>Clean and minimal design</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm">Perfect for basic content display with subtle hover effects.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" size="sm">Learn More →</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>Enhanced with shadows</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm">Features gradient background with sophisticated hover effects.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="primary" size="sm">Action</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="feature">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">R</span>
                                </div>
                                <CardTitle>Feature Card</CardTitle>
                                <CardDescription>Special accent styling</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm">Highlighted content with accent colors and special effects.</p>
                            </CardContent>
                            <CardFooter className="space-x-2">
                                <Button variant="accent" size="sm">Primary</Button>
                                <Button variant="secondary" size="sm">Secondary</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Glass Card</CardTitle>
                                <CardDescription>Ultra modern glassmorphism</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 text-sm">Modern glass effect with backdrop blur for contemporary designs.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" size="sm">Explore</Button>
                            </CardFooter>
                        </Card>

                    </div>

                    {/* New Color Scheme Cards Test */}
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div
                            className="rounded-xl p-6 border transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: '#2B2D42', borderColor: '#8D99AE' }}
                        >
                            <h3 className="text-xl font-semibold mb-2" style={{ color: '#EDF2F4' }}>Navy Primary Card</h3>
                            <p className="mb-4" style={{ color: '#8D99AE' }}>Card with navy background and blue-gray text.</p>
                            <button
                                className="px-4 py-2 rounded font-medium transition-colors"
                                style={{ backgroundColor: '#EF233C', color: '#EDF2F4' }}
                            >
                                Red Action
                            </button>
                        </div>

                        <div
                            className="rounded-xl p-6 border transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: '#EDF2F4', borderColor: '#8D99AE' }}
                        >
                            <h3 className="text-xl font-semibold mb-2" style={{ color: '#2B2D42' }}>Light Background Card</h3>
                            <p className="mb-4" style={{ color: '#8D99AE' }}>Light card with dark text for contrast.</p>
                            <button
                                className="px-4 py-2 rounded font-medium transition-colors"
                                style={{ backgroundColor: '#D80032', color: '#EDF2F4' }}
                            >
                                Dark Red Action
                            </button>
                        </div>
                    </div>
                </section>                {/* Form Elements */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">Form Elements</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">
                                    Default Input
                                </label>
                                <Input placeholder="Enter your text here..." />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">
                                    Elegant Input
                                </label>
                                <Input variant="elegant" placeholder="Elegant styling..." />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">
                                    Error State
                                </label>
                                <Input placeholder="Error example" isError />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">
                                    Disabled State
                                </label>
                                <Input placeholder="Disabled input" disabled />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Status Badges */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">Status Badges</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Badge variant="success">✓ Success</Badge>
                                <Badge variant="warning">⏳ Warning</Badge>
                                <Badge variant="danger">✕ Danger</Badge>
                                <Badge variant="info">ℹ Info</Badge>
                                <Badge variant="neutral">◐ Neutral</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Sizes</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Badge size="sm" variant="success">Small</Badge>
                                <Badge size="md" variant="success">Medium</Badge>
                                <Badge size="lg" variant="success">Large</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Dynamic Status</h3>
                            <div className="flex flex-wrap gap-4">
                                {sampleStatuses.map(status => (
                                    <Badge key={status} variant={getStatusBadgeVariant(status)}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">Typography</h2>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-white">Heading 1</h1>
                        <h2 className="text-4xl font-semibold text-gray-100">Heading 2</h2>
                        <h3 className="text-3xl font-medium text-gray-200">Heading 3</h3>
                        <p className="text-lg text-gray-300">Body Large - The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-base text-gray-400">Body Regular - Perfect for longer content and descriptions.</p>
                        <p className="text-sm text-gray-500">Body Small - Great for captions and secondary information.</p>
                        <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">
                            Code Text - monospace font
                        </code>
                    </div>
                </section>

                <div className="pt-12 text-center">
                    <p className="text-gray-500">
                        Design System v1.0 - Material & Elegant
                    </p>
                </div>

            </div>
        </div>
    )
}