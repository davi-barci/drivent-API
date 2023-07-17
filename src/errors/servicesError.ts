import { ApplicationError } from '@/protocols';

export function servicesError(): ApplicationError {
  return {
    name: 'ServicesError',
    message: 'Service not included!',
  };
}