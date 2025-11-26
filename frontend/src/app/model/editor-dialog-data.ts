import { AbstractService } from "../services/abstract.service";

export interface EditorDialogData<T> {
  object: T;           
  field: keyof T;      
  service?: AbstractService<T>; 
  markdown?: boolean; 
}
