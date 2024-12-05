/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { SubwayDownload } from '../../../assets/icons/SubwayDownload';

interface ImageDetail {
  title: string;
  date: string;
  source: string;
  category: string;
  value: string;
  location: string;
  tags: string[];
  resolution: string;
  size: string;
  assetID: string;
  sourceID: string;
  author: string;
  description: string;
  event: string;
  thumbnail: string;
  downloadCount: string;
  captureDate: string;
  copyright: string;
  orientation: string;
}

interface Asset {
  id: string;
  audit: {
    created: {
      date: string;
      user: {
        email: string;
      };
    };
  };
}

interface User {
  email?: string;
  roles?: string[];
  actions?: string[];
}

interface AssetOptions {
  service: any; // Define the service type
  canUploadAsset: boolean;
  selectEvent: (event: React.MouseEvent<HTMLSpanElement>, asset: Asset) => void;
  editImage: (id: string) => void;
  deleteAsset: (id: string) => void;
  uploadFileWithDetails: (event: React.ChangeEvent<HTMLInputElement>, assetId: string) => void;
  selectTag: (event: React.MouseEvent<HTMLAnchorElement>, tag: string) => void;
}

interface ImageItemDetailProps {
  assetOptions: AssetOptions;
  asset: Asset;
  closeDetail: () => void;
  user: User;
}

const ImageItemDetail = ({ detailData }: any) =>/*: React.FC<ImageItemDetailProps> = ({
  assetOptions,
  asset,
  closeDetail,
  user,
}: ImageItemDetailProps) */ {
  const [showExcerpt, setShowExcerpt] = useState(false);
  const [imageDetail, setImageDetail]: any = useState<ImageDetail | undefined>(undefined);



  const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };


  React.useEffect(() => {
    const fetchData = async () => {
      try {

        /* const response = await assetOptions.service.asset.getAsset(asset.id);
           const responseData = response.data;*/

        const responseData = detailData;

        setImageDetail({
          title: responseData.title ?? '',
          source: responseData.source?.value ?? '',
          category: responseData.category?.value ?? '',
          location: responseData.location?.lookup?.value ?? '',
          tags: responseData?.tags?.map((tag: any) => tag.value) ?? [],
          //@ts-ignore
          resolution: `${responseData.file.width}x${responseData.file.height}` ?? '',
          size: bytesToSize(responseData.file.size) ?? '',
          assetID: responseData.id || '',
          sourceID: responseData.metadata?.find((meta: any) => meta.key === 'id')?.value ?? '',
          author: responseData.author?.value ?? '',
          description: responseData.description ?? '',
          event: responseData.event?.value ?? '',
          thumbnail: responseData.file.thumbnails.large ?? '',
          downloadCount: responseData.file.downloadCount ?? '',
          date: responseData.audit.created.date
            ? moment(responseData.audit.created.date).locale('en').format('MMM D, YYYY HH:mm').valueOf()
            : '',
          captureDate: responseData.captureDate
            ? moment(responseData.captureDate).locale('en').format('MMM D, YYYY HH:mm')
            : '',
          copyright: responseData.copyright || 'NONE',
          orientation: responseData.file.orientation || '',
        });
      } catch (error) {
        console.error('Error fetching asset data:', error);
      }
    };

    fetchData();
  }, [detailData]);
  if (!imageDetail) return


  /*const assetEditable = () => {
    let result = false;
 
    if (
      user.email !== undefined &&
      user.roles !== undefined &&
      user.actions !== undefined &&
      asset.audit !== undefined &&
      asset.audit.created !== undefined &&
      asset.audit.created.user !== undefined
    ) {
      if (user.actions.includes('*:asset:*') || user.actions.includes('*:asset:save_other')) {
        result = true;
      } else if (
        asset.audit.created.user.email === user.email &&
        user.actions.includes('*:asset:save')
      ) {
        result = true;
      }
    }
 
    return result;
  };
 
  const prepareDownload = () => {
    assetOptions.service.asset.downloadUrl(asset.id).then((response: any) => {
      const downloadUrl = response.data.url;
      setTimeout(() => {
        const downloadAnchor = document.getElementById(`d${asset.id}`) as HTMLAnchorElement | null;
        if (downloadAnchor) downloadAnchor.click();
      }, 100);
    });
  };*/

  return (
    <div className="flex flex-col w-full h-full">
      <div className='flex justify-between '>

        <div className="">
          <span
            //onClick={(event) => assetOptions.selectEvent(event, asset)}
            className="cursor-pointer"
          >
            {imageDetail.event}
          </span>
        </div>
        <i /*onClick={closeDetail}*/ className="fas fa-times-circle exit"></i>

      </div>
      <div className=' flex gap-x-8 h-full justify-center items-center'>

        <figure className="group flex flex-col items-center h-full justify-center "
          style={{
            maxWidth: '50%',
            background: '#f9fafb',
            border: '1px solid #dfe3e8'
          }}>
          <img
            style={{
              overflowClipMargin: 'content-box',
              overflow: 'clip'
            }}
            className='w-full h-auto cursor-pointer'
            data-oritentation={imageDetail.orientation}
            src={imageDetail.thumbnail}
          //onClick={() => assetOptions.selectAsset(asset)}
          />
          <figcaption className='relative top-0 flex invisible group-hover:visible'>
            {/*assetEditable() && (
          <>
            <a onClick={() => assetOptions.editImage(asset.id)}>
              <i className="icon-pencil"></i>
            </a>
            <a onClick={() => assetOptions.deleteAsset(asset.id)}>
              <i className="icon-delete"></i>
            </a>
          </>
        )</div>*/}
            <a href="#" /*onClick={prepareDownload}*/>
              <SubwayDownload width={50} height={50} className='' />
            </a>
          </figcaption>
        </figure>
        <article className="flex w-full h-full pt-4">
          <div className="flex flex-col gap-y-3">
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('createdDate')}</strong>
              <span className="">{imageDetail.date}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('captureDate')}</strong>
              <span className="">{imageDetail.captureDate}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('source')}</strong>
              <span className="">{imageDetail.source}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('category')}</strong>
              <span className="">{imageDetail.category}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('location')}</strong>
              <span className="">{imageDetail.location}</span>
            </div>

            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('resolution')}</strong>
              <span className="">{imageDetail.resolution}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('size')}</strong>
              <span className="flex-none w-20">{imageDetail.size}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('assetId')}</strong>
              <span className="">{imageDetail.assetID}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('sourceID')}</strong>
              <span className="">{imageDetail.sourceID}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('author')}</strong>
              <span className="">{imageDetail.author}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('useCount')}</strong>
              <span className="">{imageDetail.downloadCount}</span>
            </div>
            <div className="flex gap-x-12">
              <strong className="flex-none w-20">{('path')}</strong>
              <span className="flex flex-wrap flex-none w-[425px] break-all">{imageDetail.thumbnail}</span>
            </div>
            <div className="flex gap-x-12">

              <strong className="flex-none w-20">{('tags')}</strong>
              <span className="" style={{ padding: '0 !important' }}>
                {imageDetail?.tags?.map((tag: any, index: number) => (
                  <a key={index} /*onClick={(event) => assetOptions.selectTag(event, tag)}*/>
                    {tag}
                  </a>
                ))}
              </span>
            </div>

            <div className="flex gap-x-12" >
              <strong className="flex-none w-20">{('restrictions')}</strong>
              <span className="flex flex-wrap flex-none w-[425px] break-all">{imageDetail.copyright}</span>
            </div>
          </div>
        </article>
      </div>

    </div>
  );
};

export default ImageItemDetail;
