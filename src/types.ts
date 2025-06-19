
export interface BaseReportData {
  eventDate: string; 
  eventMunicipality: string; 
  eventAddress: string; 
  eventModality: string; 
  officialRank: string; 
  officialReport: string; 
}

export interface OtherOpjEntry {
  id: string;
  opjDate: string;
  opjNumber: string;
  officerName: string;
}

export interface OpjSijinReportData extends BaseReportData {
  otherOpjs: OtherOpjEntry[];
}

export interface DattReportData extends BaseReportData {
}

export interface InpecReportData extends BaseReportData {
  penitentiaryName?: string; 
}

export enum ReportType {
  OPJ_SIJIN = 'OPJ_SIJIN',
  DATT = 'DATT',
  INPEC = 'INPEC',
}

export enum MainMenuKey {
  REPORTS = 'REPORTS',
  PARAGRAPHS = 'PARAGRAPHS',
  DASHBOARD = 'DASHBOARD',
  CONFIGURATIONS = 'CONFIGURATIONS', 
}

export enum ParagraphSubMenuKey {
  WEB_SERVICE = 'WEB_SERVICE',
  ANI = 'ANI',
}

export enum ConfigurationSubMenuKey { 
  SIJIN_TEMPLATE = 'SIJIN_TEMPLATE',
  DATT_TEMPLATE = 'DATT_TEMPLATE', 
  INPEC_TEMPLATE = 'INPEC_TEMPLATE', 
  WEB_SERVICE_PARAGRAPH_TEMPLATE = 'WEB_SERVICE_PARAGRAPH_TEMPLATE', 
  ANI_PARAGRAPH_TEMPLATE = 'ANI_PARAGRAPH_TEMPLATE', 
}

export interface ReportStatistics {
  sijin: number;
  datt: number;
  inpec: number;
}

export interface AdditionalAccusedEntry {
  id: string;
  accusedName: string;
  identificationNumber: string;
  queryResult?: 'Positivo' | 'Negativo' | ''; 
}