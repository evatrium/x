export class TestUtils {
  /**
   * Renders a given element with provided attributes
   * and returns a promise which resolves as soon as
   * rendered element becomes available.
   * @param {string} tag
   * @param {object} attributes
   * @returns {Promise<HTMLElement>}
   */
  static render(tag, attributes = {}) {
    TestUtils._renderToDocument(tag, attributes);
    return TestUtils._waitForComponentToRender(tag);
  }

  /**
   * Replaces document's body with provided element
   * including given attributes.
   * @param {string} tag
   * @param {object} attributes
   */
  static _renderToDocument(tag, attributes) {
    const htmlAttributes = TestUtils._mapObjectToHTMLAttributes(attributes);
    document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
  }

  /**
   * Converts an object to HTML string representation of attributes.
   *
   * For example: `{ foo: "bar", baz: "foo" }`
   * becomes `foo="bar" baz="foo"`
   *
   * @param {object} attributes
   * @returns {string}
   */
  static _mapObjectToHTMLAttributes(attributes) {
    return Object.entries(attributes).reduce((previous, current) => {
      return previous + ` ${current[0]}="${current[1]}"`;
    }, "");
  }

  /**
   * Returns a promise which resolves as soon as
   * requested element becomes available.
   * @param {string} tag
   * @returns {Promise<HTMLElement>}
   */
  static async _waitForComponentToRender(tag) {
    return new Promise(resolve => {
      function requestComponent() {
        const element = document.querySelector(tag);
        if (element) {
          resolve(element);
        } else {
          window.requestAnimationFrame(requestComponent);
        }
      }
      requestComponent();
    });
  }
}

 function randomName() {
  let string = btoa(Math.random())
          .toLowerCase()
          .replace(/[^a-z]+/g, ""),
      length = string.length / 2;
  return string.slice(0, length) + "-" + string.slice(length);
}

 function hashCustomElement(CustomElement) {
  let name = randomName();
  customElements.define(name, CustomElement);
  return (attributes, children) => {
    let div = document.createElement("div");
    div.innerHTML = `<${name} ${attributes || ""}>${children || ""}</${name}>`;
    document.body.appendChild(div);
    return div.firstChild;
  };
}
const till = async (time) => new Promise(resolve => setTimeout(resolve, time || 300));

