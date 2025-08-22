import Block from "./Block";

export default function renderDOM(block: Block) {
  const root = document.querySelector("#app");
  const content = block.getContent();

  root!.innerHTML = "";
  if (content) {
    root!.appendChild(content as Node);
  }
}
