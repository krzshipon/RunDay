'use client';

import { Calendar, MapPin, Users, Clock, Edit, Eye, Trash2, Copy } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description?: string;
    date: string;
    location?: string;
    distance: string;
    maxParticipants?: number;
    registeredCount?: number;
    status: 'upcoming' | 'completed' | 'cancelled';
  };
  onEdit?: (eventId: string) => void;
  onView?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (eventId: string) => void;
  className?: string;
}

export function EventCard({ 
  event, 
  onEdit, 
  onView, 
  onDelete, 
  onDuplicate,
  className = "" 
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/20';
      case 'completed':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'cancelled':
        return 'bg-[#EF233C]/10 text-[#EF233C] border-[#EF233C]/20';
      default:
        return 'bg-[#8D99AE]/10 text-[#8D99AE] border-[#8D99AE]/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getParticipationProgress = () => {
    if (!event.maxParticipants || !event.registeredCount) return 0;
    return (event.registeredCount / event.maxParticipants) * 100;
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#2B2D42] mb-1 truncate">
              {event.name}
            </h3>
            {event.description && (
              <p className="text-sm text-[#8D99AE] line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center text-sm text-[#2B2D42]">
            <Calendar className="h-4 w-4 text-[#8D99AE] mr-3" />
            <span className="font-medium mr-2">Date:</span>
            <span>{formatDate(event.date)}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center text-sm text-[#2B2D42]">
              <MapPin className="h-4 w-4 text-[#8D99AE] mr-3" />
              <span className="font-medium mr-2">Location:</span>
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Distance */}
          <div className="flex items-center text-sm text-[#2B2D42]">
            <Clock className="h-4 w-4 text-[#8D99AE] mr-3" />
            <span className="font-medium mr-2">Distance:</span>
            <span>{event.distance}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center text-sm text-[#2B2D42]">
            <Users className="h-4 w-4 text-[#8D99AE] mr-3" />
            <span className="font-medium mr-2">Participants:</span>
            <span>
              {event.registeredCount || 0}
              {event.maxParticipants && ` / ${event.maxParticipants}`}
            </span>
            {event.maxParticipants && event.registeredCount && (
              <div className="ml-3 flex-1 max-w-24">
                <div className="w-full bg-[#8D99AE]/20 rounded-full h-2">
                  <div 
                    className="bg-[#FF9F1C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(getParticipationProgress(), 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#8D99AE]/20">
          <div className="flex gap-2">
            {onView && (
              <Button
                variant="ghost"
                onClick={() => onView(event.id)}
                className="p-2 h-8 w-8"
                title="View Event"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && event.status !== 'completed' && (
              <Button
                variant="ghost"
                onClick={() => onEdit(event.id)}
                className="p-2 h-8 w-8"
                title="Edit Event"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button
                variant="ghost"
                onClick={() => onDuplicate(event.id)}
                className="p-2 h-8 w-8"
                title="Duplicate Event"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {onDelete && event.status !== 'completed' && (
            <Button
              variant="ghost"
              onClick={() => onDelete(event.id)}
              className="p-2 h-8 w-8 text-[#EF233C] hover:bg-[#EF233C]/10"
              title="Delete Event"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}