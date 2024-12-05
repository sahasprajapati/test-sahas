/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';
import React from "react";
import { AssetHQTemplete } from "./assetHQTemplete";
import { useField } from "@payloadcms/ui/forms/useField";
import { TextField } from "payload/types";
import { Modal, useModal } from '@faceless-ui/modal'
import './index.scss'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Payload } from "payload";
//import {MinimalTemplate} from 'payload/components/templates'

export const AssetHQ: React.FC<TextField & { payload: Payload }> = (props) => {
    const [payload, setPayload] = React.useState<any>(undefined)
    React.useEffect(() => {
        const fetchAndCloneImage = async () => {
            try {
                //const payload_ = await getPayloadHMR({ config: configPromise })

                console.log('AssetHQ', props.payload)
                //  console.log('AssetHQ', payload_)
            } catch (error) {
                console.log(error);
                return null;
            }
        }

        fetchAndCloneImage();
    }, [])
    const modalSlug = 'modal-1'
    const {
        toggleModal,
        isModalOpen,
        openModal,
        closeModal
    } = useModal()


    const handleCloseAssetHQ = () => {
        closeModal(modalSlug)
    };

    const handleOpenAssetHQ = () => {
        toggleModal(modalSlug)
        openModal(modalSlug)
    };

    const { value, setValue } = useField<string>({
        path: props.name,
    })

    const uploadAssetHQ = (value: any) => {
        setValue(value)
        closeModal(modalSlug)
    }


    const UploadFromComputer = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setValue(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    return (
        <>
            <Modal slug={modalSlug}>
                <div className="delete-document absolute top-0 left-0 right-0 flex justify-center items-center">
                    <AssetHQTemplete closeModal={handleCloseAssetHQ} uploadAssetHQ={uploadAssetHQ} />
                </div>
            </Modal>
            <div className="flex flex-col justify-evenly w-full max-h-96 pb-2">
                <div className=" ">
                    Thumbnail
                </div>
                <div className="h-full w-full bg-stone-100 dark:bg-[#222222]">
                    <div className="flex flex-col justify-center p-5">
                        <label>

                        </label>
                        <label className="flex justify-center items-center cursor-pointer bg-stone-100 dark:bg-[#222222] dark:hover:bg-[#333333] dark:text-neutral-100 h-16 w-[70%] hover:bg-gray-300 mb-2 text-gray-800 font-semibold py-2 px-4 border dark:border-white border-gray-400 rounded shadow">
                            <input type="file" className="hidden" onChange={UploadFromComputer} />
                            Upload from Computer
                        </label>
                        <button onClick={handleOpenAssetHQ} className="bg-stone-100 dark:bg-[#222222] dark:hover:bg-[#333333] dark:text-neutral-100 h-16 w-[70%] hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border dark:border-white border-gray-400 rounded shadow">
                            Insert form AssetHQ
                        </button>
                    </div>
                    {value && <div className="flex justify-center items-center">
                        <img src={value} className="w-28 h-28" alt="" />
                    </div>}
                </div>
            </div>
        </>
    )
}