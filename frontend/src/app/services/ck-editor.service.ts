import { Injectable } from "@angular/core";
import { EditorComponent } from "../componentes/shared/ck-editor/editor.component";

@Injectable({
    providedIn: 'root'
})
export class CKEditorService {
    constructor(private editorComponent: EditorComponent) {}
}