import { TagObject } from 'openapi3-ts';
import { GenType } from './gen-type';
import { serviceClass, tsComments } from './gen-utils';
import { Operation } from './operation';
import { Options } from './options';
import { BaseCrudInterfaceImpl } from './baseCrudInterfaceImpl';

/**
 * Context to generate a service
 */
export class Service extends GenType {

  serviceImplements: string;

  constructor(tag: TagObject, public operations: Operation[], options: Options) {
    super(tag.name, serviceClass, options);

    // Angular standards demand that services have a period separating them
    if (this.fileName.endsWith('-service')) {
      this.fileName = this.fileName.substring(0, this.fileName.length - '-service'.length) + '.service';
    }
    this.tsComments = tsComments(tag.description || '', 0);

    // Collect the imports
    for (const operation of operations) {
      operation.variants.forEach(variant => {
        // Import the variant fn
        this.addImport(variant);
        // Import the variant parameters
        this.addImport(variant.paramsImport);
        // Import the variant result type
        this.collectImports(variant.successResponse?.spec?.schema);
        // Add the request body additional dependencies
        this.collectImports(variant.requestBody?.spec?.schema, true);
      });

      // Add the parameters as additional dependencies
      for (const parameter of operation.parameters) {
        this.collectImports(parameter.spec.schema, true);
      }

      // Add the responses imports as additional dependencies
      for (const resp of operation.allResponses) {
        for (const content of resp.content ?? []) {
          this.collectImports(content.spec?.schema, true);
        }
      }

      // Add the security group imports
      for (const securityGroup of operation.security) {
        securityGroup.forEach(security => this.collectImports(security.spec.schema));
      }
    }
    this.updateImports();

    this.serviceImplements = this.generateImplements(operations);
  }

  protected skipImport(): boolean {
    return false;
  }

  protected initPathToRoot(): string {
    return '../';
  }

  protected generateImplements(operations: Operation[]): string {
    const crudInterfaces: BaseCrudInterfaceImpl[] = [];

    operations.forEach(op => {
      op.variants.forEach(variant => {
        if (variant.baseInterface.isCrud) {
          crudInterfaces.push(variant.baseInterface);
        }
      });
    });

    if (crudInterfaces.length > 0) {
      return 'implements ' + crudInterfaces.map(ci => ci.serviceInterface).join(', ');
    } else {
      return '';
    }
  }
}
