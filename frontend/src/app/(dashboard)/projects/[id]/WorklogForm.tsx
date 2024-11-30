import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useRef, useState } from 'react';

import { worklogsService } from '@/services/api';
import { Worklog } from '@/types';

type WorklogFormProps = {
  defaultWorklog?: Partial<Worklog>;
  refetch: () => Promise<unknown>;
};

export function WorklogForm({ defaultWorklog, refetch }: WorklogFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hideDialog = () => {
    setIsVisible(false);
  };

  const openDialog = () => {
    setIsVisible(true);
  };

  const onSubmit = async () => {
    await worklogsService.createWorklog({
      issueId: defaultWorklog?.issueId,
      timeSpent: Number(inputRef.current?.value),
    });
    await refetch();
    hideDialog();
  };

  return (
    <>
      <Button icon="pi pi-send" outlined rounded onClick={openDialog} />
      <Dialog
        visible={isVisible}
        onHide={hideDialog}
        footer={(
          <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={onSubmit}
            />
          </>
      )}
      >
        <label htmlFor="timeSpent" className="block text-900 font-medium mb-2">Time spent</label>
        <InputNumber
          inputRef={inputRef}
          id="timeSpent"
          value={defaultWorklog?.timeSpent}
          onChange={(i) => i.value}
          name="timeSpent"
          className="w-full mb-3"
          required
        />
      </Dialog>
    </>
  );
}
