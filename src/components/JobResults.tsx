import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

export default async function JobResults({
  filterValues: { q, type, location, remote },
}: JobResultsProps) {
  const searchString = q
    ?.split("")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.jobWhereInput = searchString
    ? {
      OR: [
        
          {title: { contains: searchString }},
          {companyName: { contains: searchString }},
          {type: { contains: searchString }},
          {locationType: { contains: searchString }},
          {location: { contains: searchString }},
      ],
     }
    : {};

    const where: Prisma.jobWhereInput = {
        AND: [
            searchFilter,
            type ? {type} : {},
            location? {location}: {},
            remote ? { locationType: "Remote"} : {},
            {approved: true}
        ],
    };

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return (
      <div className="grow space-y-4">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} /> 
          </Link>
        ))}
        {
          jobs.length === 0 &&
          <p className="text-center m-auto">
            No jobs found. Try adjusting your search filters.
          </p>
        }
      </div>
    );
  }
