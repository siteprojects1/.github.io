# Design Document: Zulme Tanık Ol

## Color Scheme
- Primary: #2C3E50 (Dark Blue)
- Secondary: #E74C3C (Red)
- Background: #F5F5F5 (Light Gray)
- Text: #333333 (Dark Gray)
- Accent: #3498DB (Light Blue)

## Typography
- Headings: 'Open Sans', sans-serif
- Body text: 'Roboto', sans-serif
- Sizes:
  - h1: 2.5rem
  - h2: 2rem
  - body: 1rem
  - small: 0.875rem

## Layout
- Max container width: 1200px
- Grid system: 
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Spacing:
  - Base unit: 8px
  - Padding: 16px
  - Margins: 24px

## Page Layout Structure
### Header Section
- Site Title: "Zulme Tanık Ol!"
  - Font size: 2.5rem
  - Font weight: 700
  - Color: Primary (#2C3E50)

- Main Subtext
  - Content: "19 Mart direnişi, Ekrem İmamoğlu’nun hukuksuzca tutuklanmasının ardından başladı. Direnişler sırasında polis, suçu sadece haklarımızı savunmak olan gençlere acımasızca müdahale etti. Plastik mermilerle, coplarla, tomalarla ve biber gazıyla Türk bayraklı evlatlarımıza, teröristten sert müdahale edildi.)" text
  - Font size: 1.2rem
  - Line height: 1.6
  - Color: Text (#333333)

- Constitution Article
  - Style: Italic
  - Background: Light gray (rgba(0,0,0,0.05))
  - Padding: 16px
  - Border-left: 4px solid Secondary (#E74C3C)
  - ("Türkiye Cumhuriyeti Anayasası Madde 34 - Herkes, önceden izin almadan, silahsız ve saldırısız toplantı ve gösteri yürüyüşü düzenleme hakkına sahiptir.")

### Image Slider Section
- Full-width container
- Height: 400px (desktop), 300px (mobile)
- Images from /images/ directory
- Navigation arrows
- Auto-advance: 5 seconds
- Transition effect: fade

### Video Grid Section
- 3-column grid (desktop)
- 2-column grid (tablet)
- 1-column grid (mobile)
- Vimeo integration
  - Thumbnail loading
  - Play overlay
  - Fullscreen support
- Infinite scroll
  - Load trigger: 500px from bottom
  - Batch size: 6 videos
  - Loading indicator

### Footer Section
- Fixed position
- Height: 60px
- Background: Primary (#2C3E50)
- Content:
  - Atatürk signature (left) - located in the project folder as \images\ataturk-signature.png
  - "Made with ❤️" text (right)
  - Both vertically centered

## Components
### Video Grid
- Aspect ratio: 16:9
- Thumbnail overlay: rgba(0,0,0,0.6)
- Hover effects: Scale 1.05
- Play button: 48x48px

### Image Slider
- Height: 400px desktop, 300px mobile
- Transition: 0.3s ease
- Control buttons: Semi-transparent (0.7 opacity)

### Footer
- Height: 60px
- Fixed position
- Centered content

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Animations
- Fade in: 0.3s ease-in
- Transitions: 0.2s ease
- Loading spinner: 1s linear infinite

## Performance Guidelines
- Lazy load images and videos
- Optimize thumbnail quality
- Minimize JavaScript bundle
- Use CSS transforms for animations
