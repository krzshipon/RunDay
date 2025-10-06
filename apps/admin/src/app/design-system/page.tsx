'use client'

import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge"

export default function DesignSystem() {
  const sampleStatuses = ['active', 'pending', 'cancelled', 'draft']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white">
      <div className="container mx-auto p-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            RunDay Design System
          </h1>
          <p className="text-xl text-gray-400">
            Elegant, Modern & Material Design Components
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-100">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-slate-950 rounded-lg border border-gray-800"></div>
              <p className="text-sm text-gray-400">Primary Black</p>
              <code className="text-xs text-gray-500">slate-950</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gray-900 rounded-lg border border-gray-700"></div>
              <p className="text-sm text-gray-400">Secondary Gray</p>
              <code className="text-xs text-gray-500">gray-900</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
              <p className="text-sm text-gray-400">Accent Blue</p>
              <code className="text-xs text-gray-500">blue-600</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg"></div>
              <p className="text-sm text-gray-400">Success Green</p>
              <code className="text-xs text-gray-500">green-600</code>
            </div>
          </div>
        </section>

        {/* Buttons */}
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
          </div>
        </section>

        {/* Cards */}
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
        </section>

        {/* Form Elements */}
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