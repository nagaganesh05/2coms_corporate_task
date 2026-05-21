// Memoized derived-state hooks for the intranet store.
//
// IMPORTANT: do NOT inline these computations into a `useStore(s => ...)`
// selector. Each call would create a new array reference, which makes
// useSyncExternalStore re-render forever ("Maximum update depth exceeded").
// Instead, subscribe to raw store fields and derive with useMemo here.

import { useMemo } from "react";
import useStore from "./useStore";

/**
 * Posts the current user is allowed to see, ordered as stored.
 * `["all"]` posts are visible to everyone; admins see everything.
 */
export function useVisiblePosts() {
  const posts = useStore((s) => s.posts);
  const employees = useStore((s) => s.employees);
  const currentUserId = useStore((s) => s.currentUserId);
  const role = useStore((s) => s.role);

  return useMemo(() => {
    const me = employees.find((e) => e.id === currentUserId);
    const myDept = me?.departmentId;
    return posts.filter((p) => {
      if (!p.visibility || p.visibility.includes("all")) return true;
      if (role === "admin") return true;
      return p.visibility.includes(myDept);
    });
  }, [posts, employees, currentUserId, role]);
}

/**
 * Top-N leaderboard derived from recognitions × badge points.
 */
export function useLeaderboard(limit = 10) {
  const recognitions = useStore((s) => s.recognitions);
  const badges = useStore((s) => s.badges);
  const employees = useStore((s) => s.employees);

  return useMemo(() => {
    const map = new Map();
    for (const r of recognitions) {
      const points = badges.find((b) => b.id === r.badgeId)?.points || 0;
      const cur = map.get(r.toId) || { id: r.toId, points: 0, count: 0 };
      cur.points += points;
      cur.count += 1;
      map.set(r.toId, cur);
    }
    return Array.from(map.values())
      .map((row) => ({
        ...row,
        employee: employees.find((e) => e.id === row.id),
      }))
      .filter((row) => row.employee)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }, [recognitions, badges, employees, limit]);
}

/** Birthdays in the next `days` days. */
export function useUpcomingBirthdays(days = 30) {
  const employees = useStore((s) => s.employees);

  return useMemo(() => {
    const today = new Date();
    return employees
      .map((e) => {
        if (!e.dob) return null;
        const dob = new Date(e.dob);
        const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        const diff = Math.round((next - today) / 86_400_000);
        return diff <= days ? { employee: e, in: diff, on: next } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.in - b.in);
  }, [employees, days]);
}

/** Employees who joined in the last `days` days. */
export function useNewJoinees(days = 60) {
  const employees = useStore((s) => s.employees);

  return useMemo(() => {
    const cutoff = new Date().getTime() - days * 86_400_000;
    return employees
      .filter((e) => new Date(e.joinDate).getTime() >= cutoff)
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
  }, [employees, days]);
}

/**
 * Updates posted by each department (project_win / footprint / milestone),
 * counting both "all" posts authored by the dept and posts targeted at the dept.
 */
export function useDepartmentImpact() {
  const posts = useStore((s) => s.posts);
  const departments = useStore((s) => s.departments);
  const employees = useStore((s) => s.employees);

  return useMemo(() => {
    return departments.map((d) => {
      const count = posts.filter((p) => {
        if (!["project_win", "footprint", "milestone"].includes(p.type))
          return false;
        if (p.visibility?.includes(d.id)) return true;
        if (p.visibility?.includes("all")) {
          if (!p.authorId) return false;
          const author = employees.find((e) => e.id === p.authorId);
          return author?.departmentId === d.id;
        }
        return false;
      }).length;
      return { departmentId: d.id, name: d.name, count };
    });
  }, [posts, departments, employees]);
}
