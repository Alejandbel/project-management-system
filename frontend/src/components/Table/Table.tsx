'use client';

import { SortOrder } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import {
  DataTable, DataTableExpandedRows, DataTableStateEvent, DataTableValueArray,
} from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import React, { FormEvent, useRef, useState } from 'react';

import { getTemplate } from './helpers';
import { TableColumn } from './types';
import { NumberToSortDirection, SortDirection, SortDirectionToNumber } from '@/types';

type TableProps<T extends Record<string, unknown>> = {
  items: T[];
  onStateChange?: (sortField: string, sortDirection?: SortDirection, limit?: number, offset?: number) => void | Promise<void>;
  columns: TableColumn<T>[];
  defaultSortField?: string;
  defaultSortOrder?: SortDirection | null;
  totalRecords?: number;
  offset?: number;
  limit?: number;
  limitStep?: number;
  size?: 'small' | 'normal' | 'large';
  rowExpansionTemplate?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void | Promise<void>;
  onDelete?: (item?: T) => void | Promise<void>;
  paginate?: boolean;
  scrollable?: boolean;
  additionalActionsTemplate?: (item: T) => React.ReactNode;
} & ({
  onSave: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  dialogForm: (defaultItem?: T) => React.ReactNode;
  actions: ('update' | 'create')[]
} | {
  onSave?: undefined;
  dialogForm?: undefined;
  actions?: undefined;
});

export function Table<T extends Record<string, unknown>>({
  items,
  onStateChange,
  columns,
  defaultSortOrder,
  defaultSortField,
  totalRecords,
  offset = 0,
  limit = 5,
  limitStep = limit,
  dialogForm,
  onSave,
  actions,
  onDelete,
  onRowClick,
  rowExpansionTemplate,
  paginate = true,
  size,
  scrollable,
  additionalActionsTemplate,
}: TableProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    defaultSortField ? SortDirectionToNumber[defaultSortOrder!] : undefined,
  );
  const [sortFiled, setSortFiled] = useState(defaultSortField);
  const [defaultItem, setDefaultItem] = useState<T | undefined>();
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray>();

  // workaround for pagination
  const paginated = Array.from(new Array(totalRecords), () => undefined) as unknown as Record<string, unknown>[];

  paginated.splice(offset, limit, ...items);

  const hideDialog = () => {
    setIsVisible(false);
  };

  const openDialog = () => {
    setIsVisible(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await onSave?.(e);
    hideDialog();
  };

  const submitForm = () => {
    formRef.current?.requestSubmit();
  };

  const createProduct = () => {
    setDefaultItem(undefined);
    openDialog();
  };

  const editProduct = (rowData: T) => {
    setDefaultItem(rowData);
    openDialog();
  };

  const stateChangeFunction = async (event: DataTableStateEvent) => {
    await onStateChange?.(event.sortField, event.sortOrder ? NumberToSortDirection[event.sortOrder] : undefined, event.rows, event.first);
    setSortFiled(event.sortField);
    setSortOrder(event.sortOrder ?? undefined);
  };

  const actionBodyTemplate = (rowData: T) => (
    <>
      {additionalActionsTemplate?.(rowData)}
      {actions?.includes('update') ? <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} /> : null}
      {onDelete && (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        className="mr-2"
        severity="danger"
        onClick={() => onDelete(rowData)}
      />
      )}
    </>
  );

  return (
    <>
      {onSave && actions?.includes('create') ? (
        <Toolbar start={(
          <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={createProduct} />
          </div>
        )}
        />
      ) : null}
      {onSave && (
        <Dialog
          visible={isVisible}
          onHide={hideDialog}
          footer={(
            <>
              <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
              <Button label="Save" icon="pi pi-check" onClick={submitForm} />
            </>
          )}
        >
          <form ref={formRef} onSubmit={onSubmit}>
            {dialogForm(defaultItem)}
          </form>
        </Dialog>
      )}
      <DataTable
        scrollable={scrollable}
        scrollHeight="40rem"
        value={paginated}
        sortField={sortFiled?.toString()}
        sortOrder={sortOrder}
        stripedRows
        paginator={paginate}
        rows={limit}
        rowsPerPageOptions={[limitStep, limitStep * 2, limitStep * 5, limitStep * 10]}
        first={offset}
        onPage={stateChangeFunction}
        onSort={stateChangeFunction}
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={rowExpansionTemplate ? (e) => setExpandedRows(e.data) : undefined}
        editMode="cell"
        size={size}
        className="m-2"
        onRowClick={(e) => onRowClick?.(e.data as T)}
        tableStyle={{ minWidth: '50rem' }}
      >
        {rowExpansionTemplate && <Column expander={() => true} style={{ width: '5rem' }} />}
        {columns.map((column) => {
          const props: Record<string, unknown> = {
            header: column.header,
            field: column.field.toString(),
            ...(column.sortable ? {
              sortable: true,
              sortFunction: () => paginated,
            } : {}),
            body: (data: T) => getTemplate<T>(data, column.field, column.type ?? column.template),
          };

          return <Column key={column.field.toString()} {...props} />;
        })}
        {actions?.includes('update') || additionalActionsTemplate || onDelete ? <Column body={actionBodyTemplate} /> : null}
      </DataTable>
    </>
  );
}
