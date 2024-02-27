import prisma from "@/lib/prisma"
export default function Home() {
  const jobs = await  prisma.job
  return (
    <main >
     
    </main>
  );
}
