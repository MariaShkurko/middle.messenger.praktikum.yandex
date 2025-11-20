import Block from "./Block";

export default function renderDOM(block: Block, rootQuery: string) {
  const root = document.querySelector(rootQuery);
  const content = block.getContent();

  root!.innerHTML = "";
  if (content) {
    root!.appendChild(content as Node);
  }
}
