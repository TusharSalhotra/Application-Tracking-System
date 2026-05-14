"use client";

import React, { type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  FileAddOutlined,
  FormOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/ats/dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Job Posting",
    path: "/admin/ats/job-posting",
    icon: <FileAddOutlined />,
  },
  {
    label: "Candidates",
    path: "/admin/ats/candidates",
    icon: <TeamOutlined />,
  },
  {
    label: "Form Builder",
    path: "/admin/ats/form-builder/new",
    icon: <FormOutlined />,
  },
  {
    label: "Settings",
    path: "/admin/ats/settings",
    icon: <SettingOutlined />,
  },
];

const publicRoutePrefixes = ["/chs-jobs", "/apply-job", "/offer-link"];

function getPageTitle(pathname: string) {
  if (pathname.includes("/job-posting")) return "Job Posting";
  if (pathname.includes("/candidates") || pathname.includes("/candidate")) {
    return "Candidates";
  }
  if (pathname.includes("/settings")) return "Settings";
  if (pathname.includes("/form-builder") || pathname.includes("/update-form")) {
    return "Form Builder";
  }
  if (publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return "Public Application";
  }
  return "Dashboard";
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isPublicRoute = publicRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPublicRoute) {
    return (
      <div className="ats-public-shell">
        <header className="ats-public-header">
          <div className="ats-brand-mark">ATS</div>
          <div>
            <strong>Northstar Applicant Hub</strong>
            <span>Candidate portal</span>
          </div>
        </header>
        <main className="ats-public-main">{children}</main>
        <footer className="ats-footer">
          Northstar Applicant Hub - Applicant Tracking System
        </footer>
      </div>
    );
  }

  return (
    <div className="ats-app-shell">
      <aside className="ats-sidebar" aria-label="Applicant tracking navigation">
        <div className="ats-sidebar-brand">
          <div className="ats-brand-mark">ATS</div>
          <div>
            <strong>Northstar ATS</strong>
            <span>Recruiting workspace</span>
          </div>
        </div>

        <nav className="ats-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `ats-nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ats-shell-body">
        <header className="ats-header">
          <div>
            <span className="ats-header-kicker">Applicant Tracking System</span>
            <h1>{getPageTitle(pathname)}</h1>
          </div>
          <div className="ats-header-user">
            <span>Demo Workspace</span>
            <strong>Admin User</strong>
          </div>
        </header>

        <main className="ats-main-content">{children}</main>

        <footer className="ats-footer">
          Northstar ATS - Demo project layout
        </footer>
      </div>
    </div>
  );
}
