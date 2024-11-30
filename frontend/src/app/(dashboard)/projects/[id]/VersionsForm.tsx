import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { projectsService } from '@/services/api';
import { Version } from '@/types';

type VersionFormProps = {
  defaultVersion?: Partial<Version>;
};

export function VersionForm({ defaultVersion }: VersionFormProps) {
  const { data: projects, isSuccess, isLoading } = useQuery({
    queryKey: ['/projects'],
    queryFn: () => projectsService.getProjects(),
  });

  const [projectId, setProjectId] = useState(defaultVersion?.projectId);
  const [isArchived, setIsArchived] = useState(defaultVersion?.isArchived ?? false);

  if (!isSuccess || isLoading) {
    return null;
  }

  return (
    <>
      <input hidden name="id" value={defaultVersion?.id} readOnly />

      <label htmlFor="title" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="title" defaultValue={defaultVersion?.title} name="title" className="w-full mb-3" required />

      <label htmlFor="projectId" className="block text-900 font-medium mb-2">Project</label>
      <Dropdown
        value={projectId}
        onChange={(e) => setProjectId(e.value)}
        options={projects.items}
        name="projectId"
        id="projectId"
        optionValue="id"
        optionLabel="name"
        className="w-full mb-3"
      />

      <label htmlFor="isArchived" className="block text-900 font-medium mb-2">Archived</label>
      <Checkbox inputId="isArchived" name="isArchived" value="isArchived" checked={isArchived} onChange={() => setIsArchived((v) => !v)} />

      <label htmlFor="startDate" className="block text-900 font-medium mb-2">Start date</label>
      <Calendar
        id="startDate"
        value={defaultVersion?.startDate ? new Date(defaultVersion?.startDate) : null}
        name="startDate"
        className="w-full mb-3"
      />

      <label htmlFor="releaseDate" className="block text-900 font-medium mb-2">Release date</label>
      <Calendar
        id="releaseDate"
        value={defaultVersion?.releaseDate ? new Date(defaultVersion?.releaseDate) : null}
        name="releaseDate"
        className="w-full mb-3"
      />
    </>
  );
}
