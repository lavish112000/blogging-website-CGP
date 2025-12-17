/**
 * Decap CMS Preview Templates
 * Shows real-time article preview before publishing
 */

(function () {
  'use strict';

  function registerPreviews() {
    if (!window.CMS || !window.h) {
      // CMS script can load slowly; avoid hard crash.
      return;
    }

    const PostPreview = ({ entry, widgetFor }) => {
      const title = entry.getIn(["data", "title"]);
      const description = entry.getIn(["data", "description"]);
      const summary = entry.getIn(["data", "summary"]);
      const author = entry.getIn(["data", "author"]);
      const date = entry.getIn(["data", "date"]);
      const featured = entry.getIn(["data", "featured"]);
      const breaking = entry.getIn(["data", "breaking"]);
      const priority = entry.getIn(["data", "priority"]);
      const tags = entry.getIn(["data", "tags"]);

      return window.h(
        "div",
        { style: { padding: "24px", fontFamily: "system-ui", maxWidth: "800px", margin: "0 auto" } },
        [
      // Breaking badge
      breaking && window.h(
        "div",
        { style: { display: "inline-block", background: "#dc2626", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", marginBottom: "8px" } },
        "🔴 BREAKING NEWS"
      ),
      
      // Featured badge
      featured && window.h(
        "div",
        { style: { display: "inline-block", background: "#16a34a", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", marginLeft: breaking ? "8px" : "0" } },
        "⭐ FEATURED"
      ),
      
      // Title
      window.h("h1", { style: { fontSize: "36px", fontWeight: "bold", marginTop: "16px", marginBottom: "12px", lineHeight: "1.2" } }, title),
      
      // Description
      window.h("p", { style: { fontSize: "18px", color: "#666", marginBottom: "16px" } }, description),
      
      // Meta info
      window.h(
        "div",
        { style: { display: "flex", gap: "16px", fontSize: "14px", color: "#888", marginBottom: "24px", borderBottom: "1px solid #e5e5e5", paddingBottom: "16px" } },
        [
          window.h("span", {}, `👤 ${author || "Lalit Choudhary"}`),
          window.h("span", {}, `📅 ${date ? new Date(date).toLocaleDateString() : "Today"}`),
          priority && window.h("span", {}, `⚡ Priority: ${priority}/10`)
        ]
      ),
      
      // Summary
      summary && window.h(
        "div",
        { style: { background: "#f0f9ff", border: "1px solid #0ea5e9", borderRadius: "8px", padding: "16px", marginBottom: "24px" } },
        [
          window.h("strong", { style: { display: "block", marginBottom: "8px", color: "#0369a1" } }, "📌 Summary (AI Overviews):"),
          window.h("p", { style: { margin: 0, color: "#333" } }, summary)
        ]
      ),
      
      // Body content
      window.h(
        "div",
        { style: { fontSize: "16px", lineHeight: "1.8", color: "#333" } },
        widgetFor("body")
      ),
      
      // Tags
      tags && tags.size > 0 && window.h(
        "div",
        { style: { marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e5e5e5" } },
        [
          window.h("strong", { style: { fontSize: "14px", color: "#666", marginRight: "8px" } }, "Tags:"),
          ...tags.map(tag => 
            window.h(
              "span",
              { style: { display: "inline-block", background: "#f3f4f6", color: "#374151", padding: "4px 12px", borderRadius: "16px", fontSize: "13px", marginRight: "8px" } },
              tag
            )
          ).toArray()
        ]
      )
        ]
      );
    };

    // Register preview template for all categories
    window.CMS.registerPreviewTemplate("technology", PostPreview);
    window.CMS.registerPreviewTemplate("business", PostPreview);
    window.CMS.registerPreviewTemplate("design", PostPreview);
    window.CMS.registerPreviewTemplate("lifestyle", PostPreview);
    window.CMS.registerPreviewTemplate("blog", PostPreview);
  }

  // Try immediately; if CMS isn't ready yet, retry shortly.
  registerPreviews();
  setTimeout(registerPreviews, 50);
  setTimeout(registerPreviews, 250);
})();
