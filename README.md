# Inventory Tracker

A multilingual inventory management dashboard demonstrating locale-aware formatting with General Translation.

**[Live Demo](https://inventory-tracker.generaltranslation.dev)** | **[General Translation Docs](https://generaltranslation.com/docs)**

## About

This app showcases a warehouse inventory dashboard with stock tracking, category breakdowns, and crafting recipes. It demonstrates how GT handles number formatting, currency display, date rendering, pluralization, and conditional branching across locales.

## GT Features Used

- `<T>` — JSX translation
- `<Currency>` — Locale-aware currency formatting
- `<Num>` — Number formatting
- `<DateTime>` — Date/time formatting
- `<Plural>` — Pluralization
- `<Branch>` — Conditional rendering by locale
- `<Var>` — Dynamic values within translations
- `<LocaleSelector>` — Language picker
- `getGT` — Server-side string translations
- `loadTranslations` — Local translation storage

## Getting Started

```bash
git clone https://github.com/gt-examples/inventory-tracker.git
cd inventory-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built With

- [Next.js](https://nextjs.org)
- [General Translation](https://generaltranslation.com) (gt-next)
- [Tailwind CSS](https://tailwindcss.com)
