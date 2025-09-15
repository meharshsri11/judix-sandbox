"use client"
import React from 'react';
import IconButton from './iconButton';
import Badge from './badge';

interface CalendarProps {
  onDateClick?: (date: number, month: string, year: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const currentDay = currentDate.getDate();

  // Calculate the first day of current month
  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  // Generate calendar days array (6 weeks * 7 days = 42 cells)
  const calendarDays: (number | null)[] = [];
  // Add empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  // Fill remaining cells with null
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  // Define event, task, and notification dates
  const hearings = [3, 5, 9, 11, 17, 19, 23];
  const tasks = [3, 5, 9, 11, 19, 21, 24, 26, 29, 30, 31];
  const notifications = [1, 11, 17, 22, 26, 30];

  // Check if date has any event
  const hasEvent = (date: number): boolean => {
    return hearings.includes(date) || tasks.includes(date);
  };

  // Function to determine event/task text for a given date
  const getEventText = (date: number): string | null => {
    if (hearings.includes(date)) {
      return 'Hearing'; // Hardcoded as per description example
    } else if (tasks.includes(date)) {
      return 'Tasks'; // Hardcoded as per description example
    }
    return null;
  };

  // Check screen size on mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Handle date click
  const handleDateClick = (date: number | null) => {
    if (date !== null) {
      setSelectedDate(date);
      
      // Call the custom function if provided
      if (onDateClick) {
        onDateClick(date, month, year);
      }
      
      // Default logging behavior
      console.log(`Date clicked: ${date} ${month} ${year}`);
    }
  };

  return (
    <div className='relative flex flex-col gap-2 h-full'>
      <div className='py-2 text-neutral-800 text-body-sm font-medium italic tracking-[0.01em] leading-[1.3em]'>
        Select any date on the calendar to view its schedule and tasks.
      </div>
      <div className="bg-neutral-100 p-2 rounded-sm shadow-sm min-w-[320px] md:min-w-[664px] flex flex-col gap-4 h-full">
        {/* Header Section */}
        <div className="flex justify-between items-center px-3">
          <IconButton
            icon='ArrowLeft1'
            variant={"neutral"}
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
              setSelectedDate(null);
            }}
            iconSize={18}
          />
          <h2 className="text-h6 font-normal leading-[100%] tracking-[1%] font-manrope text-base-800">
            {month} {year}
          </h2>
          <IconButton
            icon='ArrowRight1'
            className="text-neutral-700"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
              setSelectedDate(null);
            }}
            iconSize={18}
          />

        </div>
        <div className='h-full flex flex-col'>
          {/* Days of the Week */}
          <div className="flex">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div
                key={day}
                className="flex flex-1 p-1 h-9 justify-end font-medium font-satoshi text-body-sm text-neutral-600 uppercase leading-[130%] tracking-m
                border-b border-neutral-300
                "
              >
                <div className='p-0.5'>
                  {day}
                </div>
              </div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="w-full grid grid-cols-7 grid-rows-6 divide-solid divide-neutral-300 divide-y divide-x flex-1 border-l border-neutral-300">
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={`relative flex flex-col justify-between p-2 bg-neutral h-auto hover:bg-base-100 cursor-pointer
                           ${selectedDate === date ? 'bg-blue-50' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                {date !== null && (
                  <>
                    {/* Date and Notification Bell */}
                    <div className="relative flex justify-between items-start">
                      <div className='flex-1'>
                        {!isSmallScreen && notifications.includes(date) && (
                          <span className="text-red-500 text-sm">🔔</span>
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          date === currentDay && 
                          currentDate.getMonth() === new Date().getMonth() && 
                          currentDate.getFullYear() === new Date().getFullYear()
                            ? 'bg-blue-500 text-neutral rounded-full px-2 py-1'
                            : hasEvent(date) && isSmallScreen
                              ? 'text-red-500 border border-red-500 rounded-full px-2 py-1'
                              : 'text-base-800'
                        }`}
                      >
                        {date.toString().length === 1 ? `0${date}` : date}
                      </div>
                    </div>
                    {/* Event/Task Indicator - only show on larger screens */}
                    {!isSmallScreen && getEventText(date) && (
                      <Badge className='w-full p-1' variant={"two-tone-no-bg"} color={"blue"} corner={"sharp"} size={"small"}>
                        <div className='flex justify-between items-center'>
                          <div>
                            {getEventText(date)}
                          </div>
                          <div>
                            <span className='rounded-full bg-neutral-200 px-2'>2</span>
                          </div>
                        </div>
                      </Badge>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
