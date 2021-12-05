import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
// import 'swiper/css';
import CompanyNameForm from './CompanyNameForm';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { CForm } from '@coreui/react';

export default function CompanyForms() {
  const formSchema = object().shape({
    name: string().required(),
    city: string().required(),
    country: string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  function onSubmit(data) {

  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <h1>Set up your company</h1>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CompanyNameForm register={register} />
        {/* <Swiper>
          <SwiperSlide>
          </SwiperSlide>
        </Swiper> */}
      </CForm>
    </div>
  )
}
