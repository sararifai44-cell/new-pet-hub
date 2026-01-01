import React, { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
      <div />

      {/* --- Right side --- */}
      <div className="flex items-center gap-2 mr-2 ml-auto">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${
                  open && "bg-gray-100"
                } group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100`}
              >
                <Bell size={20} />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-3 py-3">
                    <strong className="text-gray-700 font-medium">
                      Notifications
                    </strong>
                    <div className="mt-2 py-2 text-sm text-gray-600">
                      No new notifications.
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        {/* --- Profile dropdown --- */}
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className="sr-only">Open user menu</span>

              <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center font-bold text-xs">
  A
</div>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                <div
                  onClick={() => navigate("/dashboard/profile")}
                  className="flex items-center gap-2 ui-active:bg-gray-100 rounded-sm px-4 py-2 text-gray-700 cursor-pointer"
                >
                  <User size={16} />
                  Your Profile
                </div>
              </Menu.Item>

              <Menu.Item>
                <div
                  onClick={() => navigate("/dashboard/settings")}
                  className="flex items-center gap-2 ui-active:bg-gray-100 rounded-sm px-4 py-2 text-gray-700 cursor-pointer"
                >
                  <Settings size={16} />
                  Settings
                </div>
              </Menu.Item>

              <Menu.Item>
                <div className="flex items-center gap-2 ui-active:bg-gray-100 rounded-sm px-4 py-2 text-gray-700 cursor-pointer">
                  <LogOut size={16} />
                  Sign out
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
