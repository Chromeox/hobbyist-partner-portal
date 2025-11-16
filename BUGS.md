# Web Partner Portal - Bug Tracking & Issue Log

**Project**: Hobbyist Partner Portal
**Repository**: https://github.com/Chromeox/hobbyist-partner-portal
**Production**: https://hobbyist-partner-portal.vercel.app
**Last Updated**: 2025-11-16

---

## 📋 Active Issues

### ISSUE-001: Card Styling Inconsistency Across Dashboard Pages
- **Status**: Planned
- **Priority**: Medium
- **Severity**: Low (visual consistency)
- **Reported**: 2025-11-16
- **Description**: Dashboard pages use inconsistent card styles compared to the established design system
- **Affected Pages**:
  - Reservations (5 metric cards)
  - Revenue (4 metric cards + 2 feature cards)
  - Locations (5 metric cards)
  - Reviews (2 inline stats need conversion)
  - Payouts (2 inline stats need conversion)
- **Current State**: Cards use white backgrounds instead of gradient backgrounds
- **Expected State**: All metric cards should match CARD_DESIGN_SYSTEM.md (rounded-xl, gradients, icon badges)
- **Planned Solution**: Create reusable MetricCard component, update all pages
- **Reference**: See CARD_DESIGN_SYSTEM.md for design specifications

---

## 🔨 In Progress

*No issues currently in progress*

---

## ✅ Fixed Issues

### BUG-001: Auth Session Loss on Dashboard Navigation
- **Fixed**: 2025-11-16
- **Severity**: High
- **Priority**: Critical
- **Reported**: 2025-11-16 by user testing
- **Pages Affected**:
  - Dashboard Overview → Reservations (View Schedule card)
  - Dashboard Overview → Students (Student List card)
  - Dashboard Overview → Revenue (Revenue Report card)
- **Symptoms**:
  - Clicking dashboard quick action cards redirected user to login page
  - After re-login, user was correctly redirected to intended destination page
  - Session appeared to be lost during navigation
- **Root Cause**:
  - Dashboard cards used `window.location.href` for navigation
  - This caused a full page reload, clearing React state
  - AuthContext and session state were lost during reload
  - ProtectedRoute component detected unauthenticated state during re-initialization
  - User was redirected to login with returnUrl parameter
- **Investigation Steps**:
  1. Checked middleware.ts - confirmed session refresh logic was correct
  2. Checked ProtectedRoute.tsx - confirmed redirect logic with returnUrl
  3. Checked AuthContext.tsx - confirmed session management
  4. Found `window.location.href` usage in DashboardOverview.tsx (lines 564, 583, 602, 625)
- **Solution**:
  - Replaced all `window.location.href` with `router.push()` for client-side navigation
  - Client-side routing preserves React state and authentication context
  - No page reload = no session loss
- **Files Changed**:
  - `app/dashboard/DashboardOverview.tsx` (4 locations)
- **Code Changes**:
  ```tsx
  // BEFORE
  onClick={() => window.location.href = '/dashboard/reservations'}

  // AFTER
  onClick={() => router.push('/dashboard/reservations')}
  ```
- **Commit**: `503568e`
- **Deployment**: https://vercel.com/chromeoxs-projects/web-partner/2sAWmqdeyLQZdeMmLf7DTEnrc7hK
- **Verification**: Tested navigation from dashboard to all affected pages - no login redirect
- **Related Issues**: None
- **Lessons Learned**:
  - Always use Next.js router for internal navigation
  - `window.location.href` should only be used for external URLs
  - Full page reloads clear React state including authentication

### BUG-002: TypeScript Build Error - viewMode Undefined
- **Fixed**: 2025-11-16
- **Severity**: Critical (build blocking)
- **Priority**: Urgent
- **Reported**: 2025-11-16 during deployment
- **Symptoms**:
  - Vercel build failed with TypeScript error
  - Error: "Cannot find name 'viewMode'"
  - Build log showed error at ClassManagement.tsx:546
- **Root Cause**:
  - Removed `viewMode` state variable as part of grid/list toggle removal
  - Left 4 references to `viewMode` in JSX conditional rendering
  - TypeScript compilation failed due to undefined variable
- **Investigation Steps**:
  1. Checked build logs - identified exact error location
  2. Searched for all `viewMode` references in ClassManagement.tsx
  3. Found 4 occurrences in conditional class names and layouts
- **Solution**:
  - Replaced all conditional logic with grid layout (default view)
  - Removed viewMode-dependent class names
  - Simplified card rendering to always use grid layout
- **Files Changed**:
  - `app/dashboard/classes/ClassManagement.tsx`
- **Code Changes**:
  ```tsx
  // BEFORE
  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}

  // AFTER
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  ```
- **Commit**: `dd82c6a`
- **Verification**: Build succeeded, TypeScript compilation passed
- **Related Issues**: Part of Class Management feedback implementation (BUG-003)
- **Lessons Learned**:
  - Always search for all variable references before removing state
  - Run local build before deploying to catch TypeScript errors
  - Use grep/search tools to verify complete removal

### BUG-003: Class Management Feedback Implementation
- **Fixed**: 2025-11-16
- **Severity**: Medium
- **Priority**: High
- **Reported**: 2025-11-16 from user feedback session
- **Description**: Multiple UX improvements needed for Class Management page
- **Changes Implemented**:

  **Phase 1: Header Cleanup**
  - Changed heading from "Class Management" to "Manage Your Classes"
  - Moved Schedule button beside New Class button
  - Removed grid/list toggle (unused feature)
  - Removed Assign Instructors button from header
  - Removed Recurring/Templates button
  - Deleted RecurringTemplates.tsx file (36KB/859 lines saved)

  **Phase 2: Display Improvements**
  - Hid price display, kept credits-only display
  - Added class type (category) badge with purple styling
  - Verified description displays with proper line clamping

  **Phase 3: Multiple Instructors Support**
  - Updated instructor logic to detect comma-separated names
  - Show Users icon (plural) when multiple instructors detected
  - Show User icon (singular) for single instructor

  **Phase 4: Accessibility Features**
  - Added `role="article"` to class cards
  - Added descriptive `aria-label` to all interactive elements
  - Added keyboard navigation (Enter/Space keys) to class cards
  - Added focus states with blue ring indicators
  - Marked decorative icons as `aria-hidden="true"`
  - Made entire card clickable with proper cursor styling
- **Files Changed**:
  - `app/dashboard/classes/ClassManagement.tsx` (43 insertions, 859 deletions)
  - Deleted: `app/dashboard/classes/RecurringTemplates.tsx`
- **Commit**: `add7e2a`
- **Verification**: All 4 phases tested and working
- **Related Issues**: BUG-002 (viewMode cleanup)

---

## 💡 Known Issues (Working as Intended)

### Demo Account Session Duration
- **Description**: Demo accounts (`demo@hobbyist.com`) expire after 1 hour
- **Current Behavior**: User must re-login after 1 hour
- **Expected Behavior**: This is intentional for security
- **Workaround**: Use production accounts for extended testing
- **Future Enhancement**: Consider extending to 24 hours for better UX

### Missing Import Warnings in Console
- **Description**: Browser console shows warnings about missing imports
- **Current Behavior**: Warnings appear but don't affect functionality
- **Expected Behavior**: Clean console with no warnings
- **Impact**: Low - doesn't affect user experience
- **Future Enhancement**: Clean up import statements in next refactor

---

## 🎯 Enhancement Requests

### From User Feedback (2025-11-16)
1. **Card Design Consistency** - Apply metric card design across all dashboard pages (ISSUE-001)
2. **Occupancy Rate Improvements** - Enhance dashboard metric calculations
3. **Navigation Consistency** - Review hide/show functionality across pages
4. **Revenue Analytics** - Add more detailed breakdown charts
5. **Student Engagement Metrics** - Track student attendance patterns

### From Development Team
1. **Component Library** - Create shared component library for common patterns
2. **Performance Monitoring** - Add Vercel Analytics integration
3. **Error Tracking** - Integrate Sentry for production error monitoring
4. **Bundle Size Optimization** - Further reduce JavaScript bundle size
5. **Automated Testing** - Add Playwright E2E tests for critical user flows

---

## 📊 Bug Statistics

- **Total Bugs Fixed**: 3
- **Total Active Issues**: 1
- **Average Time to Fix**: < 1 hour
- **Critical Bugs**: 1 (build blocking)
- **High Priority**: 2 (auth, UX)
- **Medium Priority**: 1 (styling)

---

## 🔄 Recent Deployments

### 2025-11-16
1. **Deployment**: https://vercel.com/chromeoxs-projects/web-partner/2sAWmqdeyLQZdeMmLf7DTEnrc7hK
   - **Commit**: `503568e`
   - **Changes**: Auth navigation fix
   - **Status**: ✅ Success

2. **Deployment**: https://vercel.com/chromeoxs-projects/web-partner/7P33k7FmAVn672r3M9boDuLdW7So
   - **Commit**: `dd82c6a`
   - **Changes**: viewMode TypeScript fix
   - **Status**: ✅ Success

3. **Deployment**: https://vercel.com/chromeoxs-projects/web-partner/DkS1fiZu4h62kvMA1a45b8FHg9gm
   - **Commit**: `add7e2a`
   - **Changes**: Class Management improvements
   - **Status**: ❌ Failed (viewMode error)

---

## 📝 Notes

### Development Workflow
1. Test changes locally before deploying
2. Use `npx vercel --prod --yes` for production deployments
3. Monitor Vercel deployment logs for build errors
4. Update this BUGS.md after each fix
5. Link commits to bug entries for traceability

### Reporting Bugs
When reporting a new bug, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots/videos if applicable
- Affected URLs/pages

### Priority Levels
- **Critical**: Blocks deployment or breaks core functionality
- **High**: Affects user experience significantly
- **Medium**: Noticeable but workaround exists
- **Low**: Minor visual or UX issue

---

*This document is maintained by the development team. Last review: 2025-11-16*
