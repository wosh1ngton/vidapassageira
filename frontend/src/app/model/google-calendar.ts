export interface GoogleCalendarStatusDTO {
  conectado: boolean;
  email?: string;
}

export interface GoogleCalendarListDTO {
  calendarId: string;
  nome: string;
  cor: string;
  selecionado: boolean;
}

export interface GoogleCalendarSelecaoDTO {
  calendarIds: string[];
}

export interface GoogleCalendarEventDTO {
  id: string;
  titulo: string;
  descricao: string;
  inicio: string;
  fim: string;
  diaInteiro: boolean;
  calendarNome: string;
  cor: string;
  localizacao: string;
}

export interface SugestaoViagemAgendaDTO {
  inicioFolga: string;
  fimFolga: string;
  diasLivres: number;
  tituloEvento: string;
}
