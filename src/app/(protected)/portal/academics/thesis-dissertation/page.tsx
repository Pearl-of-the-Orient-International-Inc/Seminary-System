"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  Filter,
  LibraryBig,
  ShieldCheck,
  SquarePen,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { GlobalDataTable } from "@/components/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatCard } from "../classes/_components/stat-card";
import { CellActions } from "./_components/cell-actions";
import { columns } from "./_components/columns";
import {
  researchRecords,
  researchStageOptions,
  researchTrackOptions,
  type ResearchRecord,
  type ResearchStage,
  type ResearchTrack,
  type ResearchType,
} from "./_components/research-data";
import { ResearchDetailsDialog } from "./_components/research-details-dialog";

type StageFilter = "ALL" | ResearchStage;
type TrackFilter = "ALL" | ResearchTrack;
type TypeFilter = "ALL" | ResearchType;

const stageFlow: ResearchStage[] = [
  "Proposal Review",
  "Writing",
  "For Defense",
  "Completed",
];

const Page = () => {
  const [stageFilter, setStageFilter] = useState<StageFilter>("ALL");
  const [trackFilter, setTrackFilter] = useState<TrackFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [records, setRecords] = useState<ResearchRecord[]>(researchRecords);
  const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStage =
        stageFilter === "ALL" || record.stage === stageFilter;
      const matchesTrack =
        trackFilter === "ALL" || record.track === trackFilter;
      const matchesType = typeFilter === "ALL" || record.type === typeFilter;

      return matchesStage && matchesTrack && matchesType;
    });
  }, [records, stageFilter, trackFilter, typeFilter]);

  const totalResearchWorks = records.length;
  const proposalReviewCount = records.filter(
    (record) => record.stage === "Proposal Review",
  ).length;
  const defenseQueueCount = records.filter(
    (record) => record.stage === "For Defense",
  ).length;
  const completedCount = records.filter(
    (record) => record.stage === "Completed",
  ).length;

  const openResearchDetails = (record: ResearchRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleAdvanceStage = (target: ResearchRecord) => {
    setRecords((current) =>
      current.map((record) => {
        if (record.referenceNumber !== target.referenceNumber) return record;
        const currentIndex = stageFlow.indexOf(record.stage);
        const nextStage =
          currentIndex >= 0 && currentIndex < stageFlow.length - 1
            ? stageFlow[currentIndex + 1]
            : stageFlow[stageFlow.length - 1];

        return { ...record, stage: nextStage };
      }),
    );
  };

  const renderCellActions = (row: Row<ResearchRecord>) => (
    <CellActions
      data={row.original}
      onView={openResearchDetails}
      onAdvanceStage={handleAdvanceStage}
    />
  );

  return (
    <>
      <section className="space-y-6 p-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-emerald-950 dark:text-emerald-50">
              Thesis and Dissertation
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Manage seminary graduate research works, advising progress, and defense
              readiness in the same academic admin visual language.
            </p>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Academics</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Thesis and Dissertation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Research Works"
            value={totalResearchWorks}
            description="Active graduate research entries"
            icon={<LibraryBig className="size-6" />}
            accentClassName="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
          />
          <StatCard
            title="Proposal Review"
            value={proposalReviewCount}
            description="Awaiting approval or revisions"
            icon={<SquarePen className="size-6" />}
            accentClassName="bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
          />
          <StatCard
            title="For Defense"
            value={defenseQueueCount}
            description="Queued for panel scheduling"
            icon={<ShieldCheck className="size-6" />}
            accentClassName="bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            description="Finished and cleared"
            icon={<BookOpenCheck className="size-6" />}
            accentClassName="bg-violet-500/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
          />
        </div>

        <Card className="overflow-hidden pt-0! border-emerald-950/10 shadow-sm dark:border-emerald-100/10">
          <div className="border-b border-emerald-950/10 bg-linear-to-r from-emerald-950 to-emerald-900 px-6 py-5 dark:border-emerald-100/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Thesis and Dissertation Directory
                </h2>
                <p className="text-sm text-emerald-50/80">
                  Review titles, advisers, and defense progress while keeping the
                  experience aligned with the rest of the seminary system.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-emerald-50/85 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Masteral
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {records.filter((record) => record.track === "Masteral").length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Doctorate
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {records.filter((record) => record.track === "Doctorate").length}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xs uppercase text-emerald-100/65">
                    Defense
                  </div>
                  <div className="mt-1 text-xl font-semibold">{defenseQueueCount}</div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <Tabs
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as TypeFilter)}
              className="mb-6"
            >
              <TabsList className="bg-emerald-950/8 dark:bg-emerald-100/8">
                <TabsTrigger value="ALL">All Research</TabsTrigger>
                <TabsTrigger value="Thesis">Thesis</TabsTrigger>
                <TabsTrigger value="Dissertation">Dissertation</TabsTrigger>
              </TabsList>
            </Tabs>

            <GlobalDataTable
              columns={columns}
              data={filteredRecords}
              cellAction={renderCellActions}
              exportFileName="thesis-dissertation"
              filterPlaceholder="Search researcher, title, adviser, or reference..."
              emptyMessage="No research records found."
              pageSizeOptions={[8, 10, 20]}
              toolbarActions={
                <>
                  <Select
                    value={trackFilter}
                    onValueChange={(value) => setTrackFilter(value as TrackFilter)}
                  >
                    <SelectTrigger className="min-w-40">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Tracks" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Tracks</SelectItem>
                      {researchTrackOptions.map((track) => (
                        <SelectItem key={track} value={track}>
                          {track}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={stageFilter}
                    onValueChange={(value) => setStageFilter(value as StageFilter)}
                  >
                    <SelectTrigger className="min-w-44">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="All Stages" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Stages</SelectItem>
                      {researchStageOptions.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <ResearchDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />
    </>
  );
};

export default Page;
