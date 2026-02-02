import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Play } from "lucide-react";
import Link from "next/link";

async function getTemplates(userId: string) {
  return db.workoutTemplate.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      exercises: {
        include: { exercise: true },
      },
    },
  });
}

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const templates = await getTemplates(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workout Templates</h1>
          <p className="text-gray-400">
            Create and manage your workout templates
          </p>
        </div>
        <Link href="/templates/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold">No templates yet</h3>
            <p className="mt-2 text-gray-400">
              Create workout templates to quickly start your sessions
            </p>
            <Link href="/templates/new" className="mt-6 inline-block">
              <Button>Create Your First Template</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="transition-colors hover:border-orange-500/50"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {template.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-gray-400">
                    {template.description}
                  </p>
                )}
                <div className="mb-4 flex flex-wrap gap-2">
                  {template.exercises.slice(0, 3).map((te) => (
                    <Badge key={te.id} variant="secondary">
                      {te.exercise.name}
                    </Badge>
                  ))}
                  {template.exercises.length > 3 && (
                    <Badge variant="outline">
                      +{template.exercises.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/workouts/new?template=${template.id}`} className="flex-1">
                    <Button className="w-full gap-2" size="sm">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  </Link>
                  <Link href={`/templates/${template.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
