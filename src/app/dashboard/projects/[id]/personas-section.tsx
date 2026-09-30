"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Persona } from "@/lib/types";
import { createPersona, deletePersona, updatePersona } from "./personas/actions";

function PersonaFields({ persona }: { persona?: Persona }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input name="name" defaultValue={persona?.name ?? ""} required />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          rows={2}
          defaultValue={persona?.description ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label>Goals</Label>
        <Textarea name="goals" rows={2} defaultValue={persona?.goals ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Pain points</Label>
        <Textarea
          name="pain_points"
          rows={2}
          defaultValue={persona?.pain_points ?? ""}
        />
      </div>
    </>
  );
}

function EditPersonaForm({
  projectId,
  persona,
  onDone,
}: {
  projectId: string;
  persona: Persona;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(updatePersona, null);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="personaId" value={persona.id} />
      <PersonaFields persona={persona} />
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function PersonaCard({
  projectId,
  persona,
}: {
  projectId: string;
  persona: Persona;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EditPersonaForm
            projectId={projectId}
            persona={persona}
            onDone={() => setEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{persona.name}</CardTitle>
          {persona.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {persona.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <form action={deletePersona}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="personaId" value={persona.id} />
            <Button type="submit" size="sm" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      </CardHeader>
      {(persona.goals || persona.pain_points) && (
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          {persona.goals && (
            <div>
              <p className="font-medium">Goals</p>
              <p className="text-muted-foreground">{persona.goals}</p>
            </div>
          )}
          {persona.pain_points && (
            <div>
              <p className="font-medium">Pain points</p>
              <p className="text-muted-foreground">{persona.pain_points}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function NewPersonaForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(createPersona, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add persona</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="projectId" value={projectId} />
          <PersonaFields />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Adding..." : "Add persona"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PersonasSection({
  projectId,
  personas,
}: {
  projectId: string;
  personas: Persona[];
}) {
  return (
    <div className="space-y-4">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} projectId={projectId} persona={persona} />
      ))}
      <NewPersonaForm key={personas.length} projectId={projectId} />
    </div>
  );
}
