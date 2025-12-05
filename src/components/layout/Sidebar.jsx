import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout } from 'react-icons/hi'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '../../lib/constants.jsx'

const baseLinkClasses =
  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:no-underline'

export default function Sidebar() {
  const location = useLocation()
  const { pathname } = location

  // نحدد أي group لازم يكون مفتوح حسب المسار الحالي (بشرط التطابق التام)
  const [openGroupKey, setOpenGroupKey] = useState(() => {
    const activeGroup = DASHBOARD_SIDEBAR_LINKS.find((link) =>
      link.children?.some((child) => pathname === child.path)
    )
    return activeGroup?.key ?? null
  })

  const toggleGroup = (key) => {
    setOpenGroupKey((prev) => (prev === key ? null : key))
  }

  return (
    <div className="bg-neutral-950 border-r border-neutral-800 w-72 p-4 flex flex-col text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-1 py-3 mb-2">
        <span className="text-neutral-100 text-lg font-bold tracking-tight">
          PetHub <span className="text-2xl">🐾</span>
        </span>
      </div>

      {/* Top Links */}
      <div className="py-4 flex-1 flex flex-col gap-1">
        {DASHBOARD_SIDEBAR_LINKS.map((link) =>
          link.children ? (
            <SidebarGroup
              key={link.key}
              link={link}
              isOpen={openGroupKey === link.key}
              onToggle={() => toggleGroup(link.key)}
            />
          ) : (
            <SidebarLink key={link.key} link={link} />
          )
        )}
      </div>

      {/* Bottom Links + Logout */}
      <div className="flex flex-col gap-1 pt-3 border-t border-neutral-800">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}

        <button
          type="button"
          className={classNames(
            baseLinkClasses,
            'text-red-400 hover:bg-red-950/30 hover:text-red-300 mt-1'
          )}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

function SidebarGroup({ link, isOpen, onToggle }) {
  const { pathname } = useLocation()

  // المجموعة تعتبر Active إذا في طفل path تبعه يطابق بالضبط
  const isGroupActive = link.children?.some((child) => pathname === child.path)

  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={onToggle}
        className={classNames(
          baseLinkClasses,
          'w-full justify-between',
          isGroupActive
            ? 'bg-neutral-800 text-white'
            : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
        )}
      >
        <span className="flex items-center gap-2">
          {link.icon && (
            <span className="text-xl flex-shrink-0 text-neutral-300">
              {link.icon}
            </span>
          )}
          <span>{link.label}</span>
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 flex flex-col gap-0.5">
          {link.children.map((child) => (
            <SidebarLink key={child.key} link={child} isChild />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarLink({ link, isChild = false }) {
  const { pathname } = useLocation()

  // ✅ بس الصفحة اللي path تبعها يطابق بالضبط
  const isActive = pathname === link.path

  return (
    <Link
      to={link.path}
      className={classNames(
        baseLinkClasses,
        isActive
          ? 'bg-neutral-800 text-white border-r-4 border-indigo-500 pr-2'
          : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100',
        isChild && 'text-sm pl-5'
      )}
    >
      {link.icon && !isChild && (
        <span className="text-xl flex-shrink-0 text-neutral-300">
          {link.icon}
        </span>
      )}
      <span>{link.label}</span>
    </Link>
  )
}
