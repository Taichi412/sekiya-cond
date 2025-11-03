# Wireframes (Text-First)

## Global
- Bottom tab: Returns | News | Events | Chat | Me
- App bar: Title per screen; right actions context-specific
- Skeletons on load; toasts for updates; confirm for destructive actions
- Light/Dark auto; large touch targets; i18n: ja/en/zh-Hant

## Returns (Owner Dashboard)
- [Header]
  - Period: 2025-11 (finalized badge if true)
  - Occupancy: 78% (big number)
  - Your payout: ¥30,000
- [Owned rooms]
  - Chips: A-101, A-102
- [12-month chart]
  - Line (occupancy %) + Bars (your payout)
- [Admin status]
  - Last updated: YYYY-MM-DD HH:mm

## News
- List: title / publish date / read dot
- Tap -> Detail (HTML body). CTA: Mark as read

## Events
- List (future): title / date range / location / my_status badge
- Detail: description, capacity, going_count/remaining, my_status
- RSVP: Join / Cancel; Participants (owner/family); Eligible participants list

## Chat
- Single thread: bubble view (manager/owner)
- Input: text + send; auto-scroll; unread marker; pull-to-refresh hint

## Me
- Profile summary: name, email, phone
- Units: list of unit codes and latest return amount
- Family: list with add/edit/delete
- Settings: language picker, notifications toggles

## Admin (CSV flow)
- Import: upload .csv (room_code, occupancy_pct, payout_yen), pick period
- Preview: average occupancy, owner breakdown (amount/rooms)
- Finalize: apply; result toast
