interface NavLink{
  href: string,
  label: string,
  icon: string
}

export const navLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "/images/overview.png",
  },
  {
    href: "/dashboard/works",
    label: "Works",
    icon: "/images/works.png",
  },
  {
    href: "/dashboard/testimonials",
    label: "Testimonials",
    icon: "/images/image.png",
  },
  {
    href: "/dashboard/inbox",
    label: "Inbox",
    icon: "/images/inbox.png",
  },

];