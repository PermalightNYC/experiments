if (!customElements.get("demo-collapse")) {
  customElements.define(
    "demo-collapse",
    class DemoCollapse extends HTMLElement {
      constructor() {
        super();
        this.button = this.querySelector('button[name="toggle"]');
        this.button.addEventListener("click", this.toggle.bind(this));
      }
      toggle() {
        this.classList.toggle("collapse");
      }
    }
  );
}
