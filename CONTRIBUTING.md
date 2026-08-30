# Contributing to VertiWiki

Thank you for your interest in contributing to VertiWiki! We welcome bug reports, feature requests, plugin contributions, and documentation improvements.

## 🚀 Quick Start for Contributors

1. **Fork the repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/<your-username>/vertiwiki.git
   cd vertiwiki
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Build standalone release**:
   ```bash
   npm run build
   ```

## 📐 Architecture & Principles
- **100% Static & Zero-Backend**: VertiWiki is distributed as a single standalone HTML bundle (`vertiwiki.html`).
- **Security**: Every rendered HTML fragment MUST be sanitized via DOMPurify. Never use `eval()`.
- **Performance**: Zero heavy UI kits. Pure modern TypeScript and GPU-accelerated CSS custom properties.

## 📄 License
By contributing to VertiWiki, you agree that your contributions will be licensed under the [MIT License](LICENSE).
