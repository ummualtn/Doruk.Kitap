import React from 'react';
import { useParams } from 'react-router-dom';
import KategoriSayfasi from './KategoriSayfasi';
import kategoriAciklamalari from '../../pages/kategoriler';

const KategoriSayfasiWrapper = () => {
  const { kategoriSlug } = useParams();
  const kategoriBilgi = kategoriAciklamalari[kategoriSlug] || {
    baslik: kategoriSlug,
    aciklama: ''
  };
  return <KategoriSayfasi kategoriSlug={kategoriSlug} kategoriBaslik={kategoriBilgi.baslik} kategoriAciklama={kategoriBilgi.aciklama} />;
};

export default KategoriSayfasiWrapper;
