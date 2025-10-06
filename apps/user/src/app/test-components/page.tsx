'use client'

import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@runday/ui"

export default function TestComponents() {
    return (
        <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #2B2D42 0%, #8D99AE 50%, #2B2D42 100%)' }}>
            <div className="container mx-auto space-y-8">

                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: '#EDF2F4' }}>
                        User App - Shared Components Test
                    </h1>
                    <p style={{ color: '#8D99AE' }}>
                        Testing shared UI components from @runday/ui package
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card variant="default">
                        <CardHeader>
                            <CardTitle>Shared UI Component</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4" style={{ color: '#8D99AE' }}>
                                This card is imported from the shared @runday/ui package and works in both admin and user apps!
                            </p>
                            <div className="flex gap-2 mb-4">
                                <Button variant="primary">Primary Action</Button>
                                <Button variant="secondary">Secondary</Button>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="info">Info</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="feature">
                        <CardHeader>
                            <CardTitle>Component Library</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p style={{ color: '#8D99AE' }}>
                                ✅ Button components<br />
                                ✅ Card components<br />
                                ✅ Input components<br />
                                ✅ Badge components<br />
                                ✅ Utility functions<br />
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}