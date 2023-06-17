import siteMetadata from '@/data/siteMetadata';

const formatDate = (date: any) => {
  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString(siteMetadata.locale, options);

  return now;
};

export default formatDate;
