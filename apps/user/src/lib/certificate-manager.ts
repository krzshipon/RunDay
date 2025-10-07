'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EventRegistrationData } from '@/lib/event-operations';

export interface CertificateRecord {
    id: string;
    user_id: string;
    event_id: string;
    registration_id: string;
    file_path: string;
    file_size: number;
    generated_at: string;
    regenerated_count: number;
}

class CertificateManager {
    private static instance: CertificateManager;
    private cache: Map<string, CertificateRecord> = new Map();

    static getInstance(): CertificateManager {
        if (!CertificateManager.instance) {
            CertificateManager.instance = new CertificateManager();
        }
        return CertificateManager.instance;
    }

    /**
     * Generate a unique filename for the certificate
     */
    private generateFilename(registration: EventRegistrationData, userId: string): string {
        const event = registration.event;
        if (!event) throw new Error('Event data not available');

        const eventName = event.name.replace(/[^a-zA-Z0-9]/g, '_');
        const eventDate = new Date(event.event_date).toISOString().split('T')[0];
        const timestamp = new Date().getTime();

        return `certificates/${userId}/${eventName}_${eventDate}_${registration.id}_${timestamp}.pdf`;
    }

    /**
     * Check if certificate exists in storage
     */
    async getCertificateRecord(registrationId: string, userId: string): Promise<CertificateRecord | null> {
        try {
            // Check cache first
            const cacheKey = `${userId}_${registrationId}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey)!;
            }

            // Query database for existing certificate
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('user_id', userId)
                .eq('registration_id', registrationId)
                .order('generated_at', { ascending: false })
                .limit(1);

            if (error) {
                console.error('Error fetching certificate record:', error);
                return null;
            }

            const record = data?.[0] || null;
            if (record) {
                this.cache.set(cacheKey, record);
            }

            return record;
        } catch (error) {
            console.error('Error getting certificate record:', error);
            return null;
        }
    }

    /**
     * Store certificate blob in Supabase Storage
     */
    async storeCertificate(
        blob: Blob,
        registration: EventRegistrationData,
        userId: string
    ): Promise<{ success: boolean; record?: CertificateRecord; error?: string }> {
        try {
            const filename = this.generateFilename(registration, userId);

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(filename, blob, {
                    contentType: 'application/pdf',
                    upsert: true // Replace if exists
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return { success: false, error: uploadError.message };
            }

            // Get existing record to check if this is a regeneration
            const existingRecord = await this.getCertificateRecord(registration.id, userId);
            const regeneratedCount = existingRecord ? existingRecord.regenerated_count + 1 : 0;

            // Store certificate record in database
            const certificateRecord: Omit<CertificateRecord, 'id' | 'generated_at'> = {
                user_id: userId,
                event_id: registration.event_id,
                registration_id: registration.id,
                file_path: uploadData.path,
                file_size: blob.size,
                regenerated_count: regeneratedCount
            };

            const { data: dbData, error: dbError } = await supabase
                .from('certificates')
                .upsert(certificateRecord, {
                    onConflict: 'user_id,registration_id'
                })
                .select()
                .single();

            if (dbError) {
                console.error('Database error:', dbError);
                return { success: false, error: dbError.message };
            }

            // Update cache
            const cacheKey = `${userId}_${registration.id}`;
            this.cache.set(cacheKey, dbData);

            return { success: true, record: dbData };
        } catch (error) {
            console.error('Error storing certificate:', error);
            return { success: false, error: 'Failed to store certificate' };
        }
    }

    /**
     * Get certificate download URL
     */
    async getCertificateDownloadUrl(filePath: string): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            const { data, error } = await supabase.storage
                .from('certificates')
                .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

            if (error) {
                console.error('Error creating signed URL:', error);
                return { success: false, error: error.message };
            }

            return { success: true, url: data.signedUrl };
        } catch (error) {
            console.error('Error getting download URL:', error);
            return { success: false, error: 'Failed to get download URL' };
        }
    }

    /**
     * Get user's certificate history
     */
    async getUserCertificates(userId: string): Promise<{ success: boolean; certificates?: CertificateRecord[]; error?: string }> {
        try {
            const { data, error } = await supabase
                .from('certificates')
                .select(`
                    *,
                    registrations!inner (
                        id,
                        bib_number,
                        finish_time,
                        position,
                        events!inner (
                            name,
                            event_date,
                            distance,
                            location
                        )
                    )
                `)
                .eq('user_id', userId)
                .order('generated_at', { ascending: false });

            if (error) {
                console.error('Error fetching user certificates:', error);
                return { success: false, error: error.message };
            }

            return { success: true, certificates: data };
        } catch (error) {
            console.error('Error getting user certificates:', error);
            return { success: false, error: 'Failed to get certificates' };
        }
    }

    /**
     * Delete certificate
     */
    async deleteCertificate(certificateId: string, userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Get certificate record
            const { data: certificate, error: fetchError } = await supabase
                .from('certificates')
                .select('*')
                .eq('id', certificateId)
                .eq('user_id', userId)
                .single();

            if (fetchError || !certificate) {
                return { success: false, error: 'Certificate not found' };
            }

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('certificates')
                .remove([certificate.file_path]);

            if (storageError) {
                console.error('Storage deletion error:', storageError);
                // Continue with database deletion even if storage fails
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('certificates')
                .delete()
                .eq('id', certificateId)
                .eq('user_id', userId);

            if (dbError) {
                console.error('Database deletion error:', dbError);
                return { success: false, error: dbError.message };
            }

            // Clear from cache
            const cacheKey = `${userId}_${certificate.registration_id}`;
            this.cache.delete(cacheKey);

            return { success: true };
        } catch (error) {
            console.error('Error deleting certificate:', error);
            return { success: false, error: 'Failed to delete certificate' };
        }
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }
}

// Hook for using certificate management
export function useCertificateManager() {
    const [manager] = useState(() => CertificateManager.getInstance());
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUserCertificates = async (userId: string) => {
        setLoading(true);
        try {
            const result = await manager.getUserCertificates(userId);
            if (result.success && result.certificates) {
                setCertificates(result.certificates);
            }
        } catch (error) {
            console.error('Error loading certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const storeCertificate = async (blob: Blob, registration: EventRegistrationData, userId: string) => {
        return await manager.storeCertificate(blob, registration, userId);
    };

    const getCertificateRecord = async (registrationId: string, userId: string) => {
        return await manager.getCertificateRecord(registrationId, userId);
    };

    const getDownloadUrl = async (filePath: string) => {
        return await manager.getCertificateDownloadUrl(filePath);
    };

    const deleteCertificate = async (certificateId: string, userId: string) => {
        const result = await manager.deleteCertificate(certificateId, userId);
        if (result.success) {
            setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
        }
        return result;
    };

    return {
        certificates,
        loading,
        loadUserCertificates,
        storeCertificate,
        getCertificateRecord,
        getDownloadUrl,
        deleteCertificate,
        clearCache: () => manager.clearCache()
    };
}

export default CertificateManager;