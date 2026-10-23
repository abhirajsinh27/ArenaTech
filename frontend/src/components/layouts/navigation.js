
import {
  Activity,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  MapPin,
  Settings,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";

export const roleLabels = {
  normal_user: "Sports Member",
  athlete: "Athlete",
  coach: "Coach",
  venue_manager: "Venue Manager",
  admin: "Administrator",
};

const sharedNavigation = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
];

const roleNavigation = {
  normal_user: [
    {
      label: "Discover",
      items: [
        {
          title: "Sports Facilities",
          path: "/facilities",
          icon: MapPin,
        },
        {
          title: "Sports Events",
          path: "/events",
          icon: CalendarDays,
        },
      ],
    },
    {
      label: "My Activity",
      items: [
        {
          title: "My Bookings",
          path: "/bookings",
          icon: Activity,
        },
      ],
    },
  ],

  athlete: [
    {
      label: "Discover",
      items: [
        {
          title: "Sports Facilities",
          path: "/facilities",
          icon: MapPin,
        },
        {
          title: "Sports Events",
          path: "/events",
          icon: CalendarDays,
        },
      ],
    },
    {
      label: "Performance",
      items: [
        {
          title: "My Training",
          path: "/training",
          icon: Dumbbell,
        },
      ],
    },
  ],

  coach: [
    {
      label: "Coaching",
      items: [
        {
          title: "Athletes",
          path: "/athletes",
          icon: Users,
        },
        {
          title: "Training",
          path: "/training",
          icon: Dumbbell,
        },
        {
          title: "Sports Events",
          path: "/events",
          icon: CalendarDays,
        },
      ],
    },
  ],

  venue_manager: [
    {
      label: "Venue Operations",
      items: [
        {
          title: "My Facilities",
          path: "/facilities",
          icon: Building2,
        },
        {
          title: "Bookings",
          path: "/bookings",
          icon: CalendarDays,
        },
        {
          title: "Maintenance",
          path: "/maintenance",
          icon: Settings,
        },
      ],
    },
  ],

  admin: [
    {
      label: "Platform Management",
      items: [
        {
          title: "Administration",
          path: "/admin",
          icon: ShieldCheck,
        },
        {
          title: "User Management",
          path: "/admin/users",
          icon: Users,
        },
        {
          title: "Facility Approvals",
          path: "/admin/facilities",
          icon: Building2,
        },
        {
          title: "Sports Facilities",
          path: "/facilities",
          icon: MapPin,
        },
      ],
    },
  ],
};

export function getNavigationForRole(role) {
  const roleSections = roleNavigation[role] ?? roleNavigation.normal_user;

  return [...sharedNavigation, ...roleSections];
}
