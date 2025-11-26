import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AbstractService } from "../../../services/abstract.service";
import { EditorDialogData } from "../../../model/editor-dialog-data";
import { marked } from "marked";
import TurndownService from 'turndown';


@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    imports: [CommonModule, CKEditorModule, FormsModule ],
    standalone: true
})
export class EditorComponent<T> implements OnInit {

    constructor(
        public config: DynamicDialogConfig<EditorDialogData<T>>,
        public ref: DynamicDialogRef,        
    ) {

    }
    public Editor = ClassicEditor;
    content: string | Promise<string> = '';
    object!: T;
    field!: keyof T;    
    isMarkdown = false;
    service: AbstractService<T>;

    @Input() showActions: boolean = true;
    @Input() editorConfig: any = {
        toolbar: {
            items: [
                'heading', '|',
                'bold', 'italic', 'link', '|',
                'bulletedList', 'numberedList', '|',
                'undo', 'redo'
            ]
        }
    };

    @Output() contentChange = new EventEmitter<string | Promise<string>>();
    @Output() save = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<void>();
    @Output() editorReady = new EventEmitter<any>();

    ngOnInit(): void {
        this.object = this.config.data.object;
        this.field = this.config.data.field;
        this.service = this.config.data.service;
        this.isMarkdown = this.config.data.markdown ?? false;

        const initialValue = this.object[this.field] as unknown as string;

        // Convert markdown → HTML only for editor display
        this.content = this.isMarkdown ? marked.parse(initialValue || '') : initialValue;
    }
    onContentChange() {
        this.contentChange.emit(this.content);
    }

    onSave() {
        let valueToSave = this.content;
        console.log('oi')
        // Convert HTML → Markdown if needed
        if (this.isMarkdown) {            
            var turndownService = new TurndownService()
            valueToSave = turndownService.turndown(this.content);
        }

        // Update object field
        (this.object as any)[this.field] = valueToSave;

        // Save if service was given
        if (this.service) {
            this.service.update(this.object).subscribe({
                next: (updated) => this.ref.close(updated),
                error: () => this.ref.close(null)
            });
        } else {
            this.ref.close(this.object);
        }
    }

    onCancel() {
        this.ref.close(null);
    }

    onEditorReady(editor:any) {
        this.editorReady.emit(editor);
    }
    
     onBlur() {
    // Optional: handle blur events
  }
}