export interface ContextMenuItem {
    id: string;
    text: string
    action?: () => void;
    isSubmenu?: boolean;
    submenuItems?: ContextMenuItem[];
    icon?: string;
    select?: boolean;
    possibleSelect?: boolean;
    unavailable?: boolean;
    premium?: boolean;
    isShow?:boolean;
}