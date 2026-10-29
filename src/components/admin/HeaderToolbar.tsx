"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  IconBell,
  IconLogout,
  IconMoon,
  IconSearch,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/auth.hooks";
import { AvatarImage } from "../ui/avatar";

const formatUserPosition = (value?: string | null) =>
  value
    ? value
        .split("_")
        .map((part) => part[0] + part.slice(1).toLowerCase())
        .join(" ")
    : "Admin";

export const HeaderToolbar = () => {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: currentUser, isLoading } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();
  const isDark = resolvedTheme === "dark";
  const displayName =
    currentUser?.name ?? (isLoading ? "Loading..." : "Admin User");
  const displayRole =
    currentUser?.position === "REGISTRAR"
      ? "Registrar"
      : currentUser?.role
        ? formatUserPosition(currentUser.role)
        : "Admin";
  const displayEmail = currentUser?.email ?? "Not signed in";
  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    [displayName],
  );

  const handleLogout = async () => {
    const redirectPath =
      currentUser?.role === "INSTRUCTOR"
        ? "/auth/instructor"
        : currentUser?.role === "MEMBER"
          ? "/auth/access"
          : "/auth/registrar";

    await logoutMutation.mutateAsync();
    router.replace(redirectPath);
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 md:px-6 md:pt-6">
      <div className="flex items-center gap-3 rounded-[1.1rem] border border-[#d8ddd5] bg-white/96 px-4 py-3 shadow-[0_10px_32px_rgba(15,54,24,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#142019]/92 dark:shadow-[0_14px_40px_rgba(0,0,0,0.3)]">
        <SidebarTrigger className="size-10 rounded-xl border border-[#dce4db] text-[#204f2a] hover:bg-[#eef3ec] dark:border-white/10 dark:text-[#d7e5d8] dark:hover:bg-white/10 md:hidden" />

        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#66756a] dark:text-[#93a295]" />
          <Input
            type="search"
            placeholder={currentUser?.role === "MEMBER" ? "Search your portal" : "Search accounts"}
            aria-label={currentUser?.role === "MEMBER" ? "Search your portal" : "Search accounts"}
            className="h-10 rounded-xl border-0 bg-[#efefea] pl-11 text-sm shadow-none placeholder:text-[#8a9186] focus-visible:ring-0 dark:bg-[#223129] dark:text-[#edf4ed] dark:placeholder:text-[#9aa89b]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-10 rounded-xl border border-[#dce4db] bg-[#efefea] text-[#395440] hover:bg-[#e6e7e0] hover:text-[#173f20] dark:border-white/10 dark:bg-[#223129] dark:text-[#d7e5d8] dark:hover:bg-[#2a3b31] dark:hover:text-white"
            aria-label="Toggle appearance"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="relative size-10 rounded-xl border border-[#dce4db] bg-[#efefea] text-[#395440] hover:bg-[#e6e7e0] hover:text-[#173f20] dark:border-white/10 dark:bg-[#223129] dark:text-[#d7e5d8] dark:hover:bg-[#2a3b31] dark:hover:text-white"
            aria-label="Notifications"
          >
            <IconBell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-[#d84c4c]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden items-center gap-3 rounded-xl px-3 py-1 text-left sm:flex"
              >
                <Avatar className="size-8 border border-[#a9bfaa] dark:border-[#4d6751]">
                  {currentUser?.avatar ? (
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-[#d7e3d4] font-medium text-[#35563b] dark:bg-[#314638] dark:text-[#e5efe6]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-xs font-semibold text-[#304736] dark:text-[#edf4ed]">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-[#7c857b] dark:text-[#9fb09f]">
                    {displayRole}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-[#dce4db] p-2"
            >
              <DropdownMenuLabel className="pb-2">
                <div className="leading-tight">
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/admin/school-settings")}
              >
                <IconUserCircle className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={logoutMutation.isPending}
                onClick={() => {
                  void handleLogout();
                }}
              >
                <IconLogout className="size-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
