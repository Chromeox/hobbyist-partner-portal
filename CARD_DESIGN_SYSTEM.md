# Partner Portal Card Design System

**Reference Page**: Dashboard Overview (`/dashboard`)

---

## Primary Card Style: Metric Cards

### Visual Design
- **Border Radius**: `rounded-xl` (0.75rem)
- **Background**: Light colored gradients based on card type
  - Revenue: `from-green-50 to-green-100` with `border-green-200`
  - Bookings: `from-blue-50 to-blue-100` with `border-blue-200`
  - Students: `from-purple-50 to-purple-100` with `border-purple-200`
  - General: `from-yellow-50 to-yellow-100` with `border-yellow-200`
- **Border**: `border` (1px solid, color-matched to background)
- **Padding**: `p-4` (1rem)
- **Shadow**: `hover:shadow-lg` with `transition-all duration-300`

### Content Structure
```tsx
<Card className="bg-gradient-to-br from-[color]-50 to-[color]-100 border-[color]-200">
  {/* Icon Badge */}
  <div className="inline-flex p-2 rounded-lg bg-[color]-100 text-[color]-600">
    <Icon className="h-4 w-4" />
  </div>

  {/* Label */}
  <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
    {label}
  </h3>

  {/* Value */}
  <p className="text-2xl font-bold text-gray-900 mt-1">
    {value}
  </p>

  {/* Change Indicator */}
  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold">
    <TrendingIcon className="h-3 w-3" />
    <span>{change}%</span>
  </div>

  {/* Period Comparison */}
  <p className="text-xs text-gray-500 mt-2">
    vs last {period}
  </p>
</Card>
```

### Key Features
- **Large Number Display**: Main metric is the focal point (text-2xl, font-bold)
- **Percentage Indicator**: Small rounded badge with arrow icon (up/down)
- **"vs last week" Text**: Subtle gray text showing time comparison
- **Icon Badge**: Small colored icon in top-left corner
- **NO Progress Bar**: Removed for cleaner design

### Color Palette (Money-Related = Green)
- **Money/Revenue**: Green shades (`green-50`, `green-100`, `green-600`)
- **Users/People**: Blue shades (`blue-50`, `blue-100`, `blue-600`)
- **Classes/Content**: Purple shades (`purple-50`, `purple-100`, `purple-600`)
- **Misc/General**: Yellow shades (`yellow-50`, `yellow-100`, `yellow-600`)

---

## Secondary Card Style: Quick Action Cards

### Visual Design
- **Background**: `bg-white`
- **Border**: `border border-gray-200`
- **Border Radius**: `rounded-xl`
- **Padding**: `p-4`
- **Shadow**: `shadow-lg hover:shadow-xl`
- **Transition**: `transition-all duration-300`

### Content Structure
```tsx
<Card className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer">
  <div className="flex items-center gap-3">
    {/* Icon with colored background */}
    <div className="p-2 bg-[color]-100 rounded-lg">
      <Icon className="h-5 w-5 text-[color]-600" />
    </div>

    {/* Text Content */}
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>

    {/* Arrow Indicator */}
    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-1" />
  </div>
</Card>
```

### Key Features
- **Icon Circle**: Colored background circle on left
- **Title + Subtitle**: Clear hierarchy
- **Chevron Arrow**: Right-pointing arrow that animates on hover
- **Clickable**: Full card is interactive with cursor-pointer

---

## Feature Card Style: Large Cards (Studio Intelligence)

### Visual Design
- **Background**: `bg-white`
- **Border**: `border border-gray-200`
- **Border Radius**: `rounded-xl`
- **Padding**: Header `pb-3`, Content `p-6`
- **Shadow**: `shadow-lg hover:shadow-lg`

### Content Structure
```tsx
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2 text-lg">
      <Icon className="h-5 w-5 text-blue-600" />
      {title}
      <Badge className="bg-blue-100 text-blue-800">{count} insights</Badge>
    </CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Multi-section content with colored backgrounds */}
  </CardContent>
</Card>
```

### Key Features
- **Inline Badge**: Badge appears inline with title (not separate)
- **Colored Sections**: Green for revenue, orange for priority, blue for recommendations
- **Grid Stats**: 3-column grid for quick metrics
- **Call-to-Action**: Bottom button to view full details

---

## Global Rules

### Border Radius Consistency
- All cards: `rounded-xl` (0.75rem)
- All badges: `rounded-full` or `rounded-lg`
- All buttons: `rounded-lg`

### Shadow Hierarchy
- Resting: `shadow-lg` or `border`
- Hover: `hover:shadow-xl`
- Transition: `transition-all duration-300`

### Typography
- Card Labels: `text-xs font-medium text-gray-600 uppercase tracking-wider`
- Card Values: `text-2xl font-bold text-gray-900`
- Card Descriptions: `text-sm text-gray-600`

### Spacing
- Card Padding: `p-4` (small), `p-6` (medium)
- Gap between elements: `gap-2`, `gap-3`, `gap-4`
- Grid gaps: `gap-4` or `gap-6`

---

## Application Guidelines

1. **Use metric card style** for all dashboard KPI cards across pages
2. **Use quick action card style** for clickable navigation items
3. **Use feature card style** for complex multi-section content
4. **Keep green backgrounds** for all money/revenue related items
5. **Maintain rounded-xl** corners across all cards
6. **NO progress bars** on metric cards
7. **Inline badges** with headings, not separate

---

*Last Updated: 2025-11-16*
*Reference: `/dashboard` page*
