import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'opportunity' | 'todo';
  title: string;
  deadline: Date;
  daysRemaining: number;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationPopover() {
  const { data, isLoading } = useQuery<{ notifications: Notification[]; count: number }>({
    queryKey: ["/api/student/notifications"],
    refetchInterval: 5 * 60 * 1000,
  });

  const notifications = data?.notifications || [];
  const count = data?.count || 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'opportunity' ? (
      <AlertCircle className="w-4 h-4 text-primary" />
    ) : (
      <CheckCircle2 className="w-4 h-4 text-secondary" />
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="relative text-gray-500 hover:text-primary p-2 rounded-md transition-colors"
          data-testid="notifications-button"
        >
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
              data-testid="notification-badge"
            >
              {count > 9 ? '9+' : count}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" data-testid="notifications-popover">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
          <p className="text-xs text-gray-500 mt-1">
            {count === 0 
              ? "No upcoming deadlines" 
              : `${count} deadline${count > 1 ? 's' : ''} in the next 7 days`}
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">All caught up!</p>
              <p className="text-xs text-gray-400 mt-1">No deadlines in the next week</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                    notification.priority === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'
                  }`}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-600">
                          Due {formatDistanceToNow(new Date(notification.deadline), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.daysRemaining === 0 
                            ? 'Due today!' 
                            : notification.daysRemaining === 1
                            ? '1 day left'
                            : `${notification.daysRemaining} days left`}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type === 'opportunity' ? 'Opportunity' : 'To-Do'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {count > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-center text-gray-500">
              Showing bookmarked opportunities and active todos
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
