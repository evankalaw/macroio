import { api, HydrateClient } from "~/trpc/server";
import Ingredients from "./_components/ingredients";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ff6f3c] to-[#ffd397] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              macroio
            </h1>
            <h2 className="text-2xl font-bold">plan meals, not headaches</h2>
          </div>

          <Ingredients />
        </div>
      </main>
    </HydrateClient>
  );
}
