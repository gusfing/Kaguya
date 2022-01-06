import AdminLayout from "@/components/layouts/AdminLayout";
import InfoItem from "@/components/seldom/InfoItem";
import Section from "@/components/seldom/Section";
import DotList from "@/components/shared/DotList";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { Anime } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import { useRouter } from "next/router";
import React from "react";
import { AiFillHeart, AiOutlineEdit } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import dayjs from "@/lib/dayjs";
import DetailsSection from "@/components/seldom/DetailsSection";
import CharacterCard from "@/components/seldom/CharacterCard";
import List from "@/components/shared/List";
import useMangaDetails from "@/hooks/useMangaDetails";
import Link from "next/link";
import Loading from "@/components/shared/Loading";

const AdminMangaLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError } = useMangaDetails(Number(id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error...</p>;
  }

  const title =
    typeof data.title === "string" ? data.title : data.title.user_preferred;

  return (
    <div className="w-full h-full">
      <Section title="Thông tin">
        <div className="relative !mb-8 flex space-y-4 md:flex-row flex-col md:space-y-0 md:space-x-4 bg-background-900 p-4 md:p-8">
          <div className="w-40 flex-shrink-0">
            <PlainCard data={data} />
          </div>

          <div className="space-y-4 self-end">
            <div className="space-y-4">
              <p className="text-3xl">{data.vietnamese_title || title}</p>
              <p className="text-lg line-clamp-5">{data.description}</p>
              <div className="flex flex-wrap items-center mt-4 text-lg gap-x-8">
                {data.average_score && (
                  <TextIcon
                    LeftIcon={MdTagFaces}
                    iconClassName="text-green-300"
                  >
                    <p>{data.average_score}%</p>
                  </TextIcon>
                )}
                <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                  <p>{numberWithCommas(data.favourites)}</p>
                </TextIcon>
                <DotList>
                  {data.genres.slice(0, 3).map((genre) => (
                    <p key={genre}>{convert(genre, "genre")}</p>
                  ))}
                </DotList>
              </div>
            </div>

            <div className="flex space-x-8 overflow-x-auto md:scroll-bar snap-x md:space-x-16">
              <InfoItem title="Quốc gia" value={data.country_of_origin} />

              <InfoItem
                title="Tình trạng"
                value={convert(data.status, "status")}
              />
              <InfoItem
                title="Giới hạn tuổi"
                value={data.is_adult ? "18+" : ""}
              />
            </div>
          </div>

          <Link href={`/admin/manga/${id}/edit`}>
            <a>
              <AiOutlineEdit className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-white/20 transition duration-300 cursor-pointer p-2" />
            </a>
          </Link>
        </div>

        <div className="space-y-12 md:col-span-8">
          {!!data?.characters?.length && (
            <DetailsSection
              title="Nhân vật"
              className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
            >
              {data.characters.map((character, index) => (
                <CharacterCard character={character} key={index} />
              ))}
            </DetailsSection>
          )}

          {!!data?.relations?.length && (
            <DetailsSection title="Manga liên quan">
              <List
                type="manga"
                data={data.relations.map((relation) => relation.manga)}
              />
            </DetailsSection>
          )}

          {!!data?.recommendations?.length && (
            <DetailsSection title="Manga hay khác">
              <List
                type="manga"
                data={data.recommendations.map(
                  (recommendation) => recommendation.manga
                )}
              />
            </DetailsSection>
          )}
        </div>
      </Section>
    </div>
  );
};

AdminMangaLayout.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminMangaLayout;
