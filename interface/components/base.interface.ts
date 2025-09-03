export interface IColumn {
    title: string;
    accessor?: string;
    render?: (record: any) => React.ReactNode;
    className?: string;
}

export interface ITableProps {
    records: any[];
    columns: IColumn[];
    totalRecords: number;
    recordsPerPage: number;
    page: number;
    onPageChange: (page: number) => void;
    recordsPerPageOptions: number[];
    onRecordsPerPageChange: (size: number) => void;
    minHeight?: number;
    paginationText?: (params: { from: number; to: number; totalRecords: number }) => string;
    className?: string;
}

export interface IInputProps {
    type?: string;
    name?: string;
    label?: string | number;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

export interface IButtonProps {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    text?: string | number;
    className?: string;
}

export interface IBanner {
    src: string;
    alt: string;
    link?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}

export interface ICarouselProps {
    images: IBanner[];
    autoPlay?: boolean;
    interval?: number;
}