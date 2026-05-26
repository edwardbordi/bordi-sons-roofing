// Plugin bundle entry. Built (with React externalized to the Core global) to
// assets/dist/widget.js and enqueued by the WordPress plugin. Registering the
// custom element is all that's needed — it self-mounts into any
// <roof-system-widget> on the page.
import { registerRoofWidget } from "./element";

registerRoofWidget();
