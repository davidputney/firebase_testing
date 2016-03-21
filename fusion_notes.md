# Fusion App notes

## Overview

What is the app?
* The app is for keeping track of information and statuses of properties -- called "partnerships" -- with low-income tax credits.
* It is a replacement for what had been a series of Excel spreadsheets and other information tracking.
* Has ~ 100 to 150 customers, mainly at Boston Capital.
* Has several "worlds" --  green world, blue world, orange world -- that serve different fundamental record-keeping functions. The part we designed is for blue world, which tracks the financials of a partnership.

Cantina's design phase contained three main areas of the app that are interconnected
  * Property status
  * Site visits
  * Notes

### Property Status
Shown in the Property Status tab.

About
* This represents the highest level view of a partnership status.
* Meant to tell the current status of the partnership quickly.
* Forms include:
  - On a Watchlist (boolean)
  - Watchlist effective date (shows only if status is changed) (date picker)
  - Watch Level (dropdown with 1-5)
  - Meeting Frequency (dropdown with weekly/monthly/none)
  - Deal Issues currently assigned to partnership (customized checkboxes)
  - Add Deal Issues (Select2 multiselect)
* Data values collected on this page are displayed elsewhere on the site.

How it works  
* Each form item can be changed individually and then saved all at once.
* However, each change made on the forms must be changelogged individually and displayed in the changelog in reverse chronological order.

### Site visits
One site visit per year on for a partnership. Site visits are part of how a site is checked to make sure it is in compliance with low-income housing tax credits rules.

Cantina worked on incorporating a notes component into the existing site visits page.

* Each site visit has two notes associated with it:
  - Previsit
  - Followup
* These notes are note types created through the notes-creating mechanism. The show up in the notes history table and on site visits and on the site visits page.

How it works
* A Site Visit record cannot be created until after a site visit is actually carried out, however, both Previsit and Followup notes can be created before a Site Visit record is created.
  - These notes get a site visit date of "Unassigned".
  - These notes go into the Unassigned Notes bucket at the top of the Site Visits page.
* Site visit notes can be edited to change the site visit date from unassigned to a the date of an existing Site Visit record.
* Once assigned to a site visit, the note appears in the Notes area of the site visit.

Property Details note
* Contains information relevant to someone carrying out a property visit. eg, The back gate is unlocked, the property manager's office is to the left.
* Editable field on the Site Visits page, not part of the overall notes creation workflow
* Is shown only on the Site Visits page, not in the Notes History table.

### Notes
Notes serve as a history of the property, what was discussed about it, when changes were made, meetings held, phone calls, etc.

Notes can be created by the create note dropdown in the upper left of all pages.

The create note process is carried out in a modal box.

Five types of notes
* General
* Billing
* Deal issues
* Previsit
* Followup

All notes have these non-editable data data points
* Partnership name
* Note creator
* List of Active Issues that have been assigned in the Property Status page. This list is here for reference when creating a note.

All notes have these editable fields when creating a note
* Note type (dropdown, five note types)
* Note date (date picker, defaults to today's date)
* Note text field (text input)
* Active issues (Select2 multiselect)
  - The options on this list are the same as the options on the Active Issues multiselect on the Property status page, but they serve a different purpose. The user chooses these to show what was discussed in the note, similar to tags on a blog post. Used for creating reports.

Other notes have additional fields specific to their purpose:
* General Note
  - Discussion Points (Select2 multiselect)
    * A list of commonly discussed items. Also similar to tags on a blog post. Used for creating reports.
* Billing
  - No extra fields
* Deal issues
  - Meeting date (date selector, defaults to today)
* Previsit
    - Site visit date (dropdown with list of existing site visit dates and unassigned)
* followup
    - Site visit date (dropdown with list of existing site visit dates and unassigned)  

Edit mode
* Omits the Note Type dropdown because it cannot be changed once a note is created.

### Notes History
Contains the five types of notes displayed in reverse chronological order by assigned note date.

It is shown in the Notes & Reminders tab.

* The following columns are sortable
  - Note date by date range
  - Note type by type.
  - Issues by deal issue type
* Note text is searchable from the search field to the right of the Notes Text label.
