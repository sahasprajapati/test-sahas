/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, createRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "./index.scss";


export const ImageEditor: React.FC<any> = ({ item, handleCloseEditMediaDialog, handleGetEditingMediaData }: any) => {
    const [image, setImage] = React.useState<string>('')

    const cropperRef = createRef<ReactCropperElement>();

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            handleGetEditingMediaData(cropperRef.current?.cropper.getCroppedCanvas()?.toDataURL())
        }
    };

    /*  const getPreviewData = () => {
          if (typeof cropperRef.current?.cropper !== "undefined") {
              const result = cropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL()
          }
      };
  */
    React.useEffect(() => {
        const fetchAndCloneImage = async () => {
            try {
                const imageUrl = item?.file?.thumbnails?.large;
                if (!imageUrl) {
                    throw new Error('Image URL is missing');
                }

                console.log('Fetching image from:', imageUrl);

                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image (status: ${response.status})`);
                }

                const blob = await response.blob();
                const clonedBlob = new Blob([blob], { type: blob.type });
                const clonedImageUrl = URL.createObjectURL(clonedBlob);

                setImage(clonedImageUrl);

                console.log('Image fetched successfully:', clonedImageUrl);
                return clonedImageUrl;
            } catch (error) {
                console.error('Error fetching image:', error);
                return null;
            }
        };

        fetchAndCloneImage();
    }, []);

    return (
        <div className="flex flex-col items-center justify-start w-full h-full">
            <div className="flex items-center justify-center w-full min-h-[400px] max-h-[400px]">

                <Cropper
                    crossOrigin={'anonymous'}
                    ref={cropperRef}
                    src={image}
                    className="w-full h-[400px]"
                    style={{ height: 400, width: '100%' }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    viewMode={1}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    background={true}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false}
                    guides={true}
                //crop={getPreviewData}

                />
            </div>
            <div className="flex items-start justify-end w-full h-full pl-8 pr-8">
                <div className="flex h-full gap-x-4 w-72">
                    <button
                        onClick={handleCloseEditMediaDialog}
                        className="w-full h-10 text-white text-lg bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Cancel
                    </button>
                    <button
                        className="w-full h-10 text-white text-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={getCropData}>
                        Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

